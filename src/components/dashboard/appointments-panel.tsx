import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Stethoscope } from "lucide-react";
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

// Real appointment status derived from the actual date on file, not a
// hardcoded "Confirmed" label that can drift from the true schedule.
function appointmentStatus(nextAppointment: string, selectedLanguage: "en" | "ta" | "hi") {
  if (!nextAppointment) return tx("No appointment scheduled", selectedLanguage);
  const date = new Date(nextAppointment);
  if (Number.isNaN(date.getTime())) return tx("No appointment scheduled", selectedLanguage);
  const daysAway = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  if (daysAway < 0) return tx("Past due — reschedule needed", selectedLanguage);
  if (daysAway === 0) return tx("Today", selectedLanguage);
  if (daysAway <= 7) return tx(`In ${daysAway} day${daysAway === 1 ? "" : "s"}`, selectedLanguage);
  return tx("Scheduled", selectedLanguage);
}

export function AppointmentsPanel() {
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
        {tx("Loading appointments…", selectedLanguage)}
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
        <div className="divide-y divide-border/70 rounded-md border border-border/70">
          <div className="flex items-center gap-3 px-4 py-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{tx("Upcoming", selectedLanguage)}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(child.nextAppointment)} · {child.doctor || tx("No doctor assigned", selectedLanguage)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{tx("Status", selectedLanguage)}</p>
              <p className="text-sm text-muted-foreground">{appointmentStatus(child.nextAppointment, selectedLanguage)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{tx("Last Visit", selectedLanguage)}</p>
              <p className="text-sm text-muted-foreground">
                {child.lastVisit ? formatDate(child.lastVisit) : tx("No visits on record yet", selectedLanguage)}
              </p>
            </div>
          </div>
          {child.vaccinationHistory.some((v) => v.status === "upcoming") ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{tx("Also due", selectedLanguage)}</p>
                <p className="text-sm text-muted-foreground">
                  {child.vaccinationHistory
                    .filter((v) => v.status === "upcoming")
                    .map((v) => v.vaccine)
                    .join(", ")}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {tx("No child profile found yet. Add one from the Hospital Dashboard.", selectedLanguage)}
        </p>
      )}
    </div>
  );
}
