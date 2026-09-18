import { useEffect, useState } from "react";
import {
  Droplet,
  Pencil,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { api, type Patient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { tx } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";

const emptyForm: Patient = {
  id: "",
  name: "",
  gender: "",
  bloodGroup: "",
  dob: "",
  nextAppointment: "",
  doctor: "",
  lastVisit: "",
  medication: "",
  allergies: [],
  vaccinationHistory: [],
};

export function HospitalDashboard() {
  const { selectedLanguage } = useAppState();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Patient>(emptyForm);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    api
      .getPatients()
      .then(setPatients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(patient: Patient) {
    setForm(patient);
    setEditingId(patient.id);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    await api.deletePatient(id);
    refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.updatePatient(editingId, form);
      } else {
        await api.createPatient({ ...form, allergies: [], vaccinationHistory: [] });
      }
      setFormOpen(false);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tx("Patient records for this hospital", selectedLanguage)}
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {tx("New Entry", selectedLanguage)}
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">{tx("Loading patients…", selectedLanguage)}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {patients.map((p) => (
            <div
              key={p.id}
              className="space-y-3 rounded-2xl border-t-4 border-t-primary border border-border/70 bg-background p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">{p.name}</p>
                    {p.sample ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {tx("Sample data", selectedLanguage)}
                      </span>
                    ) : null}
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    <User className="h-3 w-3" /> {p.id}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">{tx("Gender", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.gender || "-"}</dd>
                <dt className="text-muted-foreground">{tx("Blood Group", selectedLanguage)}</dt>
                <dd className="flex items-center gap-1 text-foreground">
                  <Droplet className="h-3 w-3 text-danger" /> {p.bloodGroup || "-"}
                </dd>
                <dt className="text-muted-foreground">{tx("Date of Birth", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.dob || "-"}</dd>
                <dt className="text-muted-foreground">{tx("Next Appointment", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.nextAppointment || "-"}</dd>
                <dt className="text-muted-foreground">{tx("Doctor", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.doctor || "-"}</dd>
                <dt className="text-muted-foreground">{tx("Last Visit", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.lastVisit || "-"}</dd>
                <dt className="text-muted-foreground">{tx("Medication", selectedLanguage)}</dt>
                <dd className="text-foreground">{p.medication || "-"}</dd>
              </dl>

              {p.allergies.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {p.allergies.join(", ")}
                </span>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-3 rounded-2xl border border-border/70 bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-foreground">
                {editingId ? tx("Edit Patient", selectedLanguage) : tx("New Patient", selectedLanguage)}
              </p>
              <button type="button" onClick={() => setFormOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                required
                disabled={Boolean(editingId)}
                placeholder={tx("Patient ID", selectedLanguage)}
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm disabled:opacity-60"
              />
              <input
                required
                placeholder={tx("Name", selectedLanguage)}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder={tx("Gender", selectedLanguage)}
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder={tx("Blood Group", selectedLanguage)}
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <input
                type="date"
                placeholder={tx("Date of Birth", selectedLanguage)}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <input
                type="date"
                placeholder={tx("Next Appointment", selectedLanguage)}
                value={form.nextAppointment}
                onChange={(e) => setForm({ ...form, nextAppointment: e.target.value })}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <input
                list="known-doctors"
                placeholder={tx("Doctor (pick existing or type a new name)", selectedLanguage)}
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className="col-span-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
              <datalist id="known-doctors">
                {Array.from(new Set(patients.map((p) => p.doctor).filter(Boolean))).map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <input
                placeholder={tx("Medication", selectedLanguage)}
                value={form.medication}
                onChange={(e) => setForm({ ...form, medication: e.target.value })}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? tx("Saving…", selectedLanguage) : tx("Save Patient", selectedLanguage)}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
