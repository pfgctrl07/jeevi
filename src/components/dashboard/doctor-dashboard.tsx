import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Pill, Stethoscope } from "lucide-react";
import { api, type Patient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { tx } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";

export function DoctorDashboard() {
  const { selectedLanguage } = useAppState();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctor, setDoctor] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [prescForm, setPrescForm] = useState({ medicine: "", dosage: "", notes: "" });
  const [noteText, setNoteText] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    setLoading(true);
    api
      .getPatients()
      .then((data) => {
        setPatients(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  const doctorNames = useMemo(
    () => Array.from(new Set(patients.map((p) => p.doctor).filter(Boolean))),
    [patients],
  );

  useEffect(() => {
    if (!doctor && doctorNames.length > 0) setDoctor(doctorNames[0]);
  }, [doctor, doctorNames]);

  const assignedPatients = patients.filter((p) => p.doctor === doctor);
  const selected = assignedPatients.find((p) => p.id === selectedId) ?? assignedPatients[0] ?? null;

  async function markVaccineDone(vaccine: string) {
    if (!selected) return;
    setBusy(true);
    try {
      await api.completeVaccine(selected.id, vaccine, doctor);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update vaccine");
    } finally {
      setBusy(false);
    }
  }

  async function submitPrescription(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !prescForm.medicine) return;
    setBusy(true);
    try {
      await api.addPrescription(selected.id, { ...prescForm, doctor });
      setPrescForm({ medicine: "", dosage: "", notes: "" });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save prescription");
    } finally {
      setBusy(false);
    }
  }

  async function submitNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !noteText.trim()) return;
    setBusy(true);
    try {
      await api.addVisitNote(selected.id, { text: noteText.trim(), doctor });
      setNoteText("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{tx("Loading…", selectedLanguage)}</p>;
  }

  if (doctorNames.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {tx("No patients have a doctor assigned yet. Assign one from the Hospital Portal to get started.", selectedLanguage)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{tx("Viewing as", selectedLanguage)}</span>
        <select
          value={doctor}
          onChange={(e) => {
            setDoctor(e.target.value);
            setSelectedId(null);
          }}
          className="h-9 rounded-md border border-border/70 bg-background px-2 text-sm font-medium text-foreground outline-none focus:border-primary"
        >
          {doctorNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr]">
        {/* Assigned patients */}
        <div className="divide-y divide-border/70 rounded-md border border-border/70 bg-card">
          {assignedPatients.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {tx("No patients assigned to this doctor yet.", selectedLanguage)}
            </p>
          ) : (
            assignedPatients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted ${
                  selected?.id === p.id ? "bg-primary/5" : ""
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.nextAppointment ? `Next visit ${p.nextAppointment}` : "No appointment scheduled"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected patient detail */}
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-md border border-border/70 bg-card p-4">
              <p className="text-base font-semibold text-foreground">{selected.name}</p>
              <p className="text-sm text-muted-foreground">
                {selected.dob} · {selected.bloodGroup || "blood group unknown"}
                {selected.allergies?.length ? ` · allergic to ${selected.allergies.join(", ")}` : ""}
              </p>
            </div>

            {/* Vaccination history — mark upcoming doses done */}
            <div className="rounded-md border border-border/70 bg-card">
              <div className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground">
                {tx("Vaccination History", selectedLanguage)}
              </div>
              <div className="divide-y divide-border/70">
                {selected.vaccinationHistory.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">{tx("No records yet.", selectedLanguage)}</p>
                ) : (
                  selected.vaccinationHistory.map((v, i) => (
                    <div key={`${v.vaccine}-${i}`} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 ${v.status === "done" ? "text-emerald-500" : "text-amber-500"}`}
                        />
                        <span className="text-sm text-foreground">{v.vaccine}</span>
                        <span className="text-xs text-muted-foreground">{v.date}</span>
                      </div>
                      {v.status === "upcoming" ? (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => markVaccineDone(v.vaccine)}>
                          {tx("Mark done", selectedLanguage)}
                        </Button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="rounded-md border border-border/70 bg-card">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground">
                <Pill className="h-4 w-4 text-primary" />
                {tx("Prescriptions", selectedLanguage)}
              </div>
              <div className="divide-y divide-border/70">
                {(selected.prescriptions ?? []).length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">{tx("No prescriptions yet.", selectedLanguage)}</p>
                ) : (
                  (selected.prescriptions ?? []).map((rx) => (
                    <div key={rx.id} className="px-4 py-2.5">
                      <p className="text-sm font-medium text-foreground">
                        {rx.medicine} {rx.dosage ? `· ${rx.dosage}` : ""}
                      </p>
                      {rx.notes ? <p className="text-sm text-muted-foreground">{rx.notes}</p> : null}
                      <p className="text-xs text-muted-foreground">{rx.date} · {rx.doctor}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={submitPrescription} className="grid gap-2 border-t border-border/70 p-3 sm:grid-cols-3">
                <input
                  required
                  placeholder={tx("Medicine", selectedLanguage)}
                  value={prescForm.medicine}
                  onChange={(e) => setPrescForm({ ...prescForm, medicine: e.target.value })}
                  className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm sm:col-span-1"
                />
                <input
                  placeholder={tx("Dosage", selectedLanguage)}
                  value={prescForm.dosage}
                  onChange={(e) => setPrescForm({ ...prescForm, dosage: e.target.value })}
                  className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm sm:col-span-1"
                />
                <input
                  placeholder={tx("Notes", selectedLanguage)}
                  value={prescForm.notes}
                  onChange={(e) => setPrescForm({ ...prescForm, notes: e.target.value })}
                  className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm sm:col-span-1"
                />
                <Button type="submit" size="sm" disabled={busy} className="sm:col-span-3">
                  {tx("Add prescription", selectedLanguage)}
                </Button>
              </form>
            </div>

            {/* Visit notes */}
            <div className="rounded-md border border-border/70 bg-card">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground">
                <ClipboardList className="h-4 w-4 text-primary" />
                {tx("Visit Notes", selectedLanguage)}
              </div>
              <div className="divide-y divide-border/70">
                {(selected.visitNotes ?? []).length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">{tx("No notes yet.", selectedLanguage)}</p>
                ) : (
                  (selected.visitNotes ?? []).map((note) => (
                    <div key={note.id} className="px-4 py-2.5">
                      <p className="text-sm text-foreground">{note.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.date).toLocaleString()} · {note.doctor}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={submitNote} className="flex gap-2 border-t border-border/70 p-3">
                <input
                  placeholder={tx("Add a visit note…", selectedLanguage)}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 rounded-md border border-border/70 bg-background px-3 py-2 text-sm"
                />
                <Button type="submit" size="sm" disabled={busy}>
                  {tx("Add", selectedLanguage)}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{tx("Select a patient to view details.", selectedLanguage)}</p>
        )}
      </div>
    </div>
  );
}
