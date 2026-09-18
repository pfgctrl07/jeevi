const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type VaccineRecord = {
  vaccine: string;
  date: string;
  status: "done" | "upcoming";
};

export type Prescription = {
  id: string;
  medicine: string;
  dosage: string;
  notes: string;
  doctor: string;
  date: string;
};

export type VisitNote = {
  id: string;
  text: string;
  doctor: string;
  date: string;
};

export type Patient = {
  id: string;
  name: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  nextAppointment: string;
  doctor: string;
  lastVisit: string;
  medication: string;
  allergies: string[];
  vaccinationHistory: VaccineRecord[];
  sample?: boolean;
  prescriptions?: Prescription[];
  visitNotes?: VisitNote[];
};

export type ActivityEntry = {
  id: string;
  type: string;
  title: string;
  detail: string;
  time: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getPatients: () => request<Patient[]>("/api/patients"),
  getPatient: (id: string) => request<Patient>(`/api/patients/${id}`),
  createPatient: (patient: Patient) =>
    request<Patient>("/api/patients", {
      method: "POST",
      body: JSON.stringify(patient),
    }),
  updatePatient: (id: string, updates: Partial<Patient>) =>
    request<Patient>(`/api/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deletePatient: (id: string) =>
    request<void>(`/api/patients/${id}`, { method: "DELETE" }),
  getActivities: () => request<ActivityEntry[]>("/api/activities"),
  completeVaccine: (id: string, vaccine: string, doctor: string) =>
    request<Patient>(`/api/patients/${id}/vaccines/complete`, {
      method: "POST",
      body: JSON.stringify({ vaccine, doctor }),
    }),
  addPrescription: (
    id: string,
    payload: { medicine: string; dosage?: string; notes?: string; doctor: string },
  ) =>
    request<Patient>(`/api/patients/${id}/prescriptions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addVisitNote: (id: string, payload: { text: string; doctor: string }) =>
    request<Patient>(`/api/patients/${id}/notes`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  chat: (payload: {
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
    language: string;
    childId?: string;
  }) =>
    request<{ reply: string }>("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  analyzeNutrition: (payload: {
    foodName: string;
    description?: string;
    childId?: string;
  }) =>
    request<{
      verdict: "SAFE" | "CAUTION" | "DANGER";
      summary: string;
      reasons: string[];
      sideEffects: string[];
    }>("/api/nutrition-analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
