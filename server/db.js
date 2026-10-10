import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "jeevitham.sqlite");
const MAX_ACTIVITY_ENTRIES = 50;

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_FILE);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT,
    blood_group TEXT,
    dob TEXT,
    next_appointment TEXT,
    doctor TEXT,
    last_visit TEXT,
    medication TEXT,
    sample INTEGER DEFAULT 0,
    allergies TEXT NOT NULL DEFAULT '[]',
    vaccination_history TEXT NOT NULL DEFAULT '[]',
    prescriptions TEXT NOT NULL DEFAULT '[]',
    visit_notes TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS activity (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT,
    time TEXT NOT NULL
  );
`);

// --- Seed data: only inserted the first time the DB file is created, so a
// demo deploy has something to look at without ever overwriting real data
// entered later. ---

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

function rowToPatient(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    gender: row.gender ?? "",
    bloodGroup: row.blood_group ?? "",
    dob: row.dob ?? "",
    nextAppointment: row.next_appointment ?? "",
    doctor: row.doctor ?? "",
    lastVisit: row.last_visit ?? "",
    medication: row.medication ?? "",
    sample: Boolean(row.sample),
    allergies: JSON.parse(row.allergies),
    vaccinationHistory: JSON.parse(row.vaccination_history),
    prescriptions: JSON.parse(row.prescriptions),
    visitNotes: JSON.parse(row.visit_notes),
  };
}

const insertPatientStmt = db.prepare(`
  INSERT INTO patients (
    id, name, gender, blood_group, dob, next_appointment, doctor, last_visit,
    medication, sample, allergies, vaccination_history, prescriptions, visit_notes
  ) VALUES (
    @id, @name, @gender, @bloodGroup, @dob, @nextAppointment, @doctor, @lastVisit,
    @medication, @sample, @allergies, @vaccinationHistory, @prescriptions, @visitNotes
  )
`);

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM patients").get();
  if (count > 0) return;

  const insertMany = db.transaction((patients) => {
    for (const patient of patients) {
      insertPatientStmt.run({
        id: patient.id,
        name: patient.name,
        gender: patient.gender ?? "",
        bloodGroup: patient.bloodGroup ?? "",
        dob: patient.dob ?? "",
        nextAppointment: patient.nextAppointment ?? "",
        doctor: patient.doctor ?? "",
        lastVisit: patient.lastVisit ?? "",
        medication: patient.medication ?? "",
        sample: patient.sample ? 1 : 0,
        allergies: JSON.stringify(patient.allergies ?? []),
        vaccinationHistory: JSON.stringify(patient.vaccinationHistory ?? []),
        prescriptions: JSON.stringify(patient.prescriptions ?? []),
        visitNotes: JSON.stringify(patient.visitNotes ?? []),
      });
    }
  });
  insertMany(seedPatients);
}

seedIfEmpty();

// The README advertises this login for demos — seed it on first boot so a
// fresh deploy (no .sqlite file yet) has it ready, same as the sample patients.
function seedDemoUserIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM users").get();
  if (count > 0) return;

  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, created_at)
     VALUES (@id, @name, @email, @passwordHash, @role, @createdAt)`,
  ).run({
    id: crypto.randomUUID(),
    name: "Admin Demo",
    email: "admin@jeevitham.in",
    passwordHash: bcrypt.hashSync("123456", 10),
    role: "parent",
    createdAt: new Date().toISOString(),
  });
}

seedDemoUserIfEmpty();

// --- Patients ---

export function getPatients() {
  const rows = db.prepare("SELECT * FROM patients").all();
  return rows.map(rowToPatient);
}

export function getPatient(id) {
  const row = db.prepare("SELECT * FROM patients WHERE id = ?").get(id);
  return rowToPatient(row);
}

export function createPatient(patient) {
  insertPatientStmt.run({
    id: patient.id,
    name: patient.name,
    gender: patient.gender ?? "",
    bloodGroup: patient.bloodGroup ?? "",
    dob: patient.dob ?? "",
    nextAppointment: patient.nextAppointment ?? "",
    doctor: patient.doctor ?? "",
    lastVisit: patient.lastVisit ?? "",
    medication: patient.medication ?? "",
    sample: patient.sample ? 1 : 0,
    allergies: JSON.stringify(patient.allergies ?? []),
    vaccinationHistory: JSON.stringify(patient.vaccinationHistory ?? []),
    prescriptions: JSON.stringify(patient.prescriptions ?? []),
    visitNotes: JSON.stringify(patient.visitNotes ?? []),
  });
  return getPatient(patient.id);
}

const patientColumnMap = {
  name: "name",
  gender: "gender",
  bloodGroup: "blood_group",
  dob: "dob",
  nextAppointment: "next_appointment",
  doctor: "doctor",
  lastVisit: "last_visit",
  medication: "medication",
  allergies: "allergies",
  vaccinationHistory: "vaccination_history",
  prescriptions: "prescriptions",
  visitNotes: "visit_notes",
};
const jsonPatientFields = new Set([
  "allergies",
  "vaccinationHistory",
  "prescriptions",
  "visitNotes",
]);

export function updatePatient(id, updates) {
  const existing = getPatient(id);
  if (!existing) return null;

  const setClauses = [];
  const params = { id };
  for (const [key, value] of Object.entries(updates)) {
    const column = patientColumnMap[key];
    if (!column) continue;
    setClauses.push(`${column} = @${key}`);
    params[key] = jsonPatientFields.has(key) ? JSON.stringify(value) : value;
  }

  if (setClauses.length > 0) {
    db.prepare(`UPDATE patients SET ${setClauses.join(", ")} WHERE id = @id`).run(params);
  }

  return getPatient(id);
}

export function deletePatient(id) {
  const result = db.prepare("DELETE FROM patients WHERE id = ?").run(id);
  return result.changes > 0;
}

// --- Activity log: a real, append-only record of things that actually
// happened in the app, shown in the "Recent Activities" timeline instead of
// static placeholder text. ---

export function getActivities() {
  return db.prepare("SELECT * FROM activity ORDER BY time DESC").all();
}

export function addActivity({ type, title, detail }) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    detail,
    time: new Date().toISOString(),
  };
  db.prepare(
    "INSERT INTO activity (id, type, title, detail, time) VALUES (@id, @type, @title, @detail, @time)",
  ).run(entry);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM activity").get();
  if (count > MAX_ACTIVITY_ENTRIES) {
    db.prepare(
      `DELETE FROM activity WHERE id IN (
        SELECT id FROM activity ORDER BY time ASC LIMIT @excess
      )`,
    ).run({ excess: count - MAX_ACTIVITY_ENTRIES });
  }

  return entry;
}

// --- Users ---

export function createUser({ id, name, email, passwordHash, role }) {
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, created_at)
     VALUES (@id, @name, @email, @passwordHash, @role, @createdAt)`,
  ).run({ id, name, email, passwordHash, role, createdAt: new Date().toISOString() });
  return getUserById(id);
}

function rowToUser(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export function getUserByEmail(email) {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  return row ?? null;
}

export function getUserById(id) {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return rowToUser(row);
}
