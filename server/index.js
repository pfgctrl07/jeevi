import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getActivities,
  addActivity,
  createUser,
  getUserByEmail,
} from "./db.js";
import { hashPassword, verifyPassword, signToken, requireAuth } from "./auth.js";

const app = express();
// CORS_ORIGIN lets the deployed API be locked to the real frontend domain
// once it's known; unset (local dev, or before that domain is decided) falls
// back to allowing any origin.
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN } : undefined));
app.use(express.json());

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

function requireAI(res) {
  if (!genAI) {
    res.status(503).json({
      error:
        "GEMINI_API_KEY is not configured on the server. Add it to server/.env and restart.",
    });
    return false;
  }
  return true;
}

// Gemini returns 503 "high demand" fairly often even under normal load — a
// couple of short retries absorbs that without surfacing a false failure.
async function withGeminiRetry(fn, retries = 2) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err?.status === 503 && attempt < retries;
      if (!isRetryable) throw err;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

// The free Gemini tier caps this project at 5 requests/minute per model —
// surface that plainly instead of a generic failure when it's the cause.
function geminiErrorMessage(err) {
  if (err?.status === 429) {
    return "Jeevi AI has hit its per-minute request limit on the free plan. Wait about a minute and try again.";
  }
  if (err?.status === 503) {
    return "Jeevi AI is temporarily overloaded upstream. Please try again in a few seconds.";
  }
  return "AI request failed";
}

// --- Auth ---

const VALID_ROLES = ["parent", "doctor", "hospital"];

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const normalizedRole = VALID_ROLES.includes(role) ? role : "parent";
  const normalizedEmail = email.trim().toLowerCase();

  if (getUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: normalizedRole,
  });

  const token = signToken(user);
  res.status(201).json({ token, user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const userRow = getUserByEmail(email.trim().toLowerCase());
  const passwordOk = userRow ? await verifyPassword(password, userRow.password_hash) : false;
  if (!userRow || !passwordOk) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
  const token = signToken(user);
  res.json({ token, user });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// --- Patients (Hospital Dashboard + Vaccination Dashboard) ---

app.get("/api/patients", requireAuth, async (_req, res) => {
  res.json(await getPatients());
});

app.get("/api/patients/:id", requireAuth, async (req, res) => {
  const patient = await getPatient(req.params.id);
  if (!patient) return res.status(404).json({ error: "Not found" });
  res.json(patient);
});

app.post("/api/patients", requireAuth, async (req, res) => {
  const patient = req.body;
  if (!patient?.id || !patient?.name) {
    return res.status(400).json({ error: "id and name are required" });
  }
  const existing = await getPatient(patient.id);
  if (existing) {
    return res.status(409).json({ error: "Patient ID already exists" });
  }
  const created = await createPatient(patient);
  await addActivity({
    type: "patient_added",
    title: `New patient added: ${created.name}`,
    detail: `Patient ID ${created.id}`,
  });
  res.status(201).json(created);
});

app.put("/api/patients/:id", requireAuth, async (req, res) => {
  const updated = await updatePatient(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Not found" });
  await addActivity({
    type: "patient_updated",
    title: `Patient record updated: ${updated.name}`,
    detail: `Fields changed: ${Object.keys(req.body).join(", ") || "none"}`,
  });
  res.json(updated);
});

app.delete("/api/patients/:id", requireAuth, async (req, res) => {
  const existing = await getPatient(req.params.id);
  const removed = await deletePatient(req.params.id);
  if (!removed) return res.status(404).json({ error: "Not found" });
  await addActivity({
    type: "patient_removed",
    title: `Patient removed: ${existing?.name ?? req.params.id}`,
    detail: `Patient ID ${req.params.id}`,
  });
  res.status(204).end();
});

// --- Doctor actions: the write side of the Hospital → Doctor → Parent loop ---

app.post("/api/patients/:id/vaccines/complete", requireAuth, async (req, res) => {
  const { vaccine, doctor } = req.body;
  if (!vaccine) return res.status(400).json({ error: "vaccine is required" });

  const patient = await getPatient(req.params.id);
  if (!patient) return res.status(404).json({ error: "Not found" });

  const index = patient.vaccinationHistory.findIndex(
    (v) => v.vaccine === vaccine && v.status === "upcoming",
  );
  if (index === -1) {
    return res.status(404).json({ error: "No upcoming dose with that name found" });
  }

  const vaccinationHistory = [...patient.vaccinationHistory];
  vaccinationHistory[index] = {
    ...vaccinationHistory[index],
    status: "done",
    date: new Date().toISOString().slice(0, 10),
  };

  const updated = await updatePatient(req.params.id, { vaccinationHistory });
  await addActivity({
    type: "vaccine_completed",
    title: `Vaccine marked done: ${vaccine} for ${patient.name}`,
    detail: doctor ? `Confirmed by ${doctor}` : "Confirmed by doctor",
  });
  res.json(updated);
});

app.post("/api/patients/:id/prescriptions", requireAuth, async (req, res) => {
  const { medicine, dosage = "", notes = "", doctor = "" } = req.body;
  if (!medicine) return res.status(400).json({ error: "medicine is required" });

  const patient = await getPatient(req.params.id);
  if (!patient) return res.status(404).json({ error: "Not found" });

  const prescription = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    medicine,
    dosage,
    notes,
    doctor,
    date: new Date().toISOString().slice(0, 10),
  };
  const prescriptions = [...(patient.prescriptions ?? []), prescription];

  const updated = await updatePatient(req.params.id, { prescriptions });
  await addActivity({
    type: "prescription_added",
    title: `Prescription written: ${medicine} for ${patient.name}`,
    detail: doctor ? `By ${doctor}` : "By doctor",
  });
  res.status(201).json(updated);
});

app.post("/api/patients/:id/notes", requireAuth, async (req, res) => {
  const { text, doctor = "" } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  const patient = await getPatient(req.params.id);
  if (!patient) return res.status(404).json({ error: "Not found" });

  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    doctor,
    date: new Date().toISOString(),
  };
  const visitNotes = [...(patient.visitNotes ?? []), note];

  const updated = await updatePatient(req.params.id, { visitNotes });
  await addActivity({
    type: "visit_note_added",
    title: `Visit note added for ${patient.name}`,
    detail: doctor ? `By ${doctor}` : "By doctor",
  });
  res.status(201).json(updated);
});

// --- Jeevi AI chatbot ---

app.post("/api/chat", requireAuth, async (req, res) => {
  if (!requireAI(res)) return;

  const { message, history = [], language = "en", childId } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  let childContext = "";
  if (childId) {
    const child = await getPatient(childId);
    if (child) {
      childContext = `The parent's child on file: name ${child.name}, DOB ${child.dob}, blood group ${child.bloodGroup}, known allergies: ${
        child.allergies?.length ? child.allergies.join(", ") : "none recorded"
      }, current medication: ${child.medication || "none"}, vaccination history: ${JSON.stringify(
        child.vaccinationHistory,
      )}.`;
    }
  }

  const languageNote =
    language === "ta"
      ? "Respond in Tamil."
      : language === "hi"
        ? "Respond in Hindi."
        : "Respond in English.";

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: `You are Jeevi, a warm, reassuring maternal and child healthcare assistant inside the Jeevitham app. You help parents of children aged 1-5 with vaccination timing, nutrition, common symptoms, growth milestones, and simple next steps. Keep answers short, plain-language, and never replace a doctor for anything serious — tell parents to see a doctor or use Emergency Access for urgent concerns. Write in plain prose sentences only — no markdown, no asterisks, no bullet or numbered lists, no headings. ${languageNote} ${childContext}`,
    });

    const firstUserIndex = history.findIndex((h) => h.role === "user");
    const trimmedHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);

    const chat = model.startChat({
      history: trimmedHistory.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
    });

    const result = await withGeminiRetry(() => chat.sendMessage(message));
    const reply = result.response.text();

    await addActivity({
      type: "ai_chat",
      title: "Jeevi AI question asked",
      detail: message.length > 100 ? `${message.slice(0, 100)}…` : message,
    });

    res.json({ reply });
  } catch (err) {
    console.error("chat error", err);
    res.status(err?.status === 429 ? 429 : 500).json({ error: geminiErrorMessage(err) });
  }
});

// --- Nutrition / food-label analyzer ---

app.post("/api/nutrition-analyze", requireAuth, async (req, res) => {
  if (!requireAI(res)) return;

  const { foodName, description = "", childId } = req.body;
  if (!foodName) return res.status(400).json({ error: "foodName is required" });

  let child = null;
  if (childId) child = await getPatient(childId);

  const allergyNote = child?.allergies?.length
    ? `The child is known to be sensitive to: ${child.allergies.join(", ")}.`
    : "No known allergies are on file for this child.";

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction:
        'You are a pediatric nutrition safety checker for children aged 1-5. Given a food item and a child\'s known allergies, decide if it is SAFE, CAUTION, or DANGER. Respond ONLY with strict JSON: {"verdict": "SAFE"|"CAUTION"|"DANGER", "summary": string, "reasons": string[], "sideEffects": string[]}. Be concise, plain-language, parent-friendly.',
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await withGeminiRetry(() =>
      model.generateContent(
        `Food: ${foodName}. Details: ${description || "none given"}. ${allergyNote} Child age context: ${
          child?.dob ? `born ${child.dob}` : "age not specified, assume 1-5 years"
        }.`,
      ),
    );

    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        verdict: "CAUTION",
        summary: text.slice(0, 300),
        reasons: [],
        sideEffects: [],
      };
    }

    await addActivity({
      type: "nutrition_check",
      title: `Nutrition check: ${foodName}`,
      detail: `Result: ${parsed.verdict}`,
    });

    res.json(parsed);
  } catch (err) {
    console.error("nutrition-analyze error", err);
    res.status(err?.status === 429 ? 429 : 500).json({ error: geminiErrorMessage(err) });
  }
});

app.get("/api/activities", requireAuth, async (_req, res) => {
  const activities = await getActivities();
  res.json(activities.slice(0, 10));
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(genAI) });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Jeevitham API listening on http://localhost:${PORT}`);
});
