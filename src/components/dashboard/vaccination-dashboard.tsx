import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Pill, ShieldCheck, Stethoscope } from "lucide-react";
import { api, type Patient } from "@/lib/api";
import { tx } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function VaccinationDashboard() {
  const { selectedLanguage } = useAppState();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPatients()
      .then((data) => {
        setPatients(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const child = patients.find((p) => p.id === selectedId);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background p-6 text-sm text-muted-foreground">
        {tx("Loading vaccination records…", selectedLanguage)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/40 bg-danger/10 p-6 text-sm text-danger">
        {tx("Could not reach the Jeevitham API.", selectedLanguage)} ({error})
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {patients.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                p.id === selectedId
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/70 bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {p.name}
              {p.sample ? <span className="ml-1 text-xs opacity-70">({tx("sample", selectedLanguage)})</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      {child ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
            <div className="flex items-center gap-2 text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{tx("Date of Birth", selectedLanguage)}</p>
            </div>
            <p className="font-semibold text-foreground">{formatDate(child.dob)}</p>

            <div className="flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{tx("Next Appointment", selectedLanguage)}</p>
            </div>
            <p className="font-semibold text-foreground">{formatDate(child.nextAppointment)}</p>

            <div className="flex items-center gap-2 text-foreground">
              <Stethoscope className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{tx("Doctor's Name", selectedLanguage)}</p>
            </div>
            <p className="font-semibold text-foreground">{child.doctor}</p>

            <div className="flex items-center gap-2 text-foreground">
              <Pill className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">{tx("Current Medication", selectedLanguage)}</p>
            </div>
            <p className="font-semibold text-foreground">{child.medication || tx("None", selectedLanguage)}</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="font-semibold">{tx("Vaccination History", selectedLanguage)}</p>
            </div>
            <div className="space-y-2">
              {child.vaccinationHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {tx("No vaccination records yet.", selectedLanguage)}
                </p>
              ) : (
                child.vaccinationHistory.map((v, i) => (
                  <div
                    key={`${v.vaccine}-${i}`}
                    className="flex items-center justify-between rounded-xl bg-card px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          v.status === "done" ? "text-emerald-500" : "text-amber-500"
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground">{v.vaccine}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(v.date)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {tx("No child profile found yet. Add one from the Hospital Dashboard.", selectedLanguage)}
        </p>
      )}
    </div>
  );
}
