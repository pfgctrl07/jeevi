import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const PATIENTS_FILE = path.join(DATA_DIR, "patients.json");
const ACTIVITY_FILE = path.join(DATA_DIR, "activity.json");
const MAX_ACTIVITY_ENTRIES = 50;

const seedPatients = [
  {
    id: "1109",
    name: "Krithick",
    gender: "male",
    bloodGroup: "O+",
    dob: "2025-04-15",
    nextAppointment: "2026-09-29",
    doctor: "Dr. Ramanan",
    lastVisit: "2026-09-09T07:59:00",
    medication: "Dolo 65",
    allergies: ["lactose", "peanuts"],
    sample: true,
    prescriptions: [],
    visitNotes: [],
    vaccinationHistory: [
      { vaccine: "BCG", date: "2025-04-15", status: "done" },
      { vaccine: "OPV", date: "2025-04-15", status: "done" },
      { vaccine: "Hep B", date: "2025-04-15", status: "done" },
      { vaccine: "DTaP + Hib + IPV", date: "2026-09-27", status: "upcoming" },
    ],
  },
  {
    id: "0000",
    name: "Dhaanush",
    gender: "male",
    bloodGroup: "B+",
    dob: "2025-03-05",
    nextAppointment: "2026-10-10",
    doctor: "Dr. Meera Krishnan",
    lastVisit: "2026-09-13T19:54:00",
    medication: "None",
    allergies: [],
    sample: true,
    prescriptions: [],
    visitNotes: [],
    vaccinationHistory: [
      { vaccine: "BCG", date: "2025-03-05", status: "done" },
      { vaccine: "OPV", date: "2025-03-05", status: "done" },
      { vaccine: "MMR", date: "2026-10-05", status: "upcoming" },
    ],
  },
];

async function ensureStore() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(PATIENTS_FILE)) {
    await writeFile(PATIENTS_FILE, JSON.stringify(seedPatients, null, 2));
  }
  if (!existsSync(ACTIVITY_FILE)) {
    await writeFile(ACTIVITY_FILE, JSON.stringify([], null, 2));
  }
}

export async function getPatients() {
  await ensureStore();
  const raw = await readFile(PATIENTS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function getPatient(id) {
  const patients = await getPatients();
  return patients.find((p) => p.id === id) ?? null;
}

export async function savePatients(patients) {
  await ensureStore();
  await writeFile(PATIENTS_FILE, JSON.stringify(patients, null, 2));
}

export async function createPatient(patient) {
  const patients = await getPatients();
  patients.push(patient);
  await savePatients(patients);
  return patient;
}

export async function updatePatient(id, updates) {
  const patients = await getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;
  patients[index] = { ...patients[index], ...updates };
  await savePatients(patients);
  return patients[index];
}

export async function deletePatient(id) {
  const patients = await getPatients();
  const next = patients.filter((p) => p.id !== id);
  await savePatients(next);
  return next.length !== patients.length;
}

// --- Activity log: a real, append-only record of things that actually
// happened in the app, shown in the "Recent Activities" timeline instead of
// static placeholder text. ---

export async function getActivities() {
  await ensureStore();
  const raw = await readFile(ACTIVITY_FILE, "utf-8");
  const entries = JSON.parse(raw);
  return entries.sort((a, b) => new Date(b.time) - new Date(a.time));
}

export async function addActivity({ type, title, detail }) {
  await ensureStore();
  const raw = await readFile(ACTIVITY_FILE, "utf-8");
  const entries = JSON.parse(raw);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    detail,
    time: new Date().toISOString(),
  };
  entries.push(entry);
  const trimmed = entries.slice(-MAX_ACTIVITY_ENTRIES);
  await writeFile(ACTIVITY_FILE, JSON.stringify(trimmed, null, 2));
  return entry;
}
