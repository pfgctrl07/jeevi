import { Activity, CalendarClock, Syringe } from "lucide-react";
import { GlassStat } from "@/components/ui/glass-chip";
import { t } from "@/lib/data";
import type { Patient } from "@/lib/api";
import type { LabelSet, SummaryItem } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";
import { usePrimaryPatient } from "@/hooks/use-primary-patient";

const STAT_ICONS = [Syringe, CalendarClock, Activity];

const NEXT_VACCINE_TITLE: LabelSet = { en: "Next Vaccine", ta: "அடுத்த தடுப்பூசி", hi: "अगला टीका" };
const NEXT_VISIT_TITLE: LabelSet = { en: "Next Visit", ta: "அடுத்த சந்திப்பு", hi: "अगली मुलाकात" };
const HEALTH_STATUS_TITLE: LabelSet = { en: "Health Status", ta: "நல நிலை", hi: "स्वास्थ्य स्थिति" };

function sameText(value: string): LabelSet {
  return { en: value, ta: value, hi: value };
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function computeSummary(patient: Patient): SummaryItem[] {
  const today = new Date();

  const upcomingVaccines = patient.vaccinationHistory
    .filter((v) => v.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextVaccine = upcomingVaccines[0];
  const nextVaccineOverdue = nextVaccine ? new Date(nextVaccine.date) < today : false;

  const vaccineItem: SummaryItem = nextVaccine
    ? {
        title: NEXT_VACCINE_TITLE,
        value: sameText(nextVaccine.vaccine),
        supporting: sameText(formatDate(nextVaccine.date)),
        tone: nextVaccineOverdue ? "danger" : "primary",
      }
    : {
        title: NEXT_VACCINE_TITLE,
        value: sameText("All caught up"),
        supporting: sameText("No upcoming vaccines scheduled"),
        tone: "success",
      };

  const appointmentDate = patient.nextAppointment ? new Date(patient.nextAppointment) : null;
  const appointmentOverdue = appointmentDate ? appointmentDate < today : false;

  const visitItem: SummaryItem = {
    title: NEXT_VISIT_TITLE,
    value: sameText(patient.doctor || "Not assigned"),
    supporting: sameText(
      patient.nextAppointment ? formatDate(patient.nextAppointment) : "No appointment scheduled",
    ),
    tone: !patient.nextAppointment ? "primary" : appointmentOverdue ? "danger" : "warning",
  };

  const overdueCount = [
    nextVaccineOverdue ? 1 : 0,
    appointmentOverdue ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const healthItem: SummaryItem = overdueCount > 0
    ? {
        title: HEALTH_STATUS_TITLE,
        value: sameText("Needs attention"),
        supporting: sameText(
          overdueCount === 1 ? "1 item is overdue" : `${overdueCount} items are overdue`,
        ),
        tone: "warning",
      }
    : {
        title: HEALTH_STATUS_TITLE,
        value: sameText("On track"),
        supporting: sameText(
          patient.medication && patient.medication.toLowerCase() !== "none"
            ? `Currently on ${patient.medication}`
            : "No current medication noted",
        ),
        tone: "success",
      };

  return [vaccineItem, visitItem, healthItem];
}

const STACK_OFFSET = ["ml-0", "ml-6 sm:ml-10", "ml-0"];

export function LiveSummary({ layout = "row" }: { layout?: "row" | "stack" }) {
  const { selectedLanguage } = useAppState();
  const { patient } = usePrimaryPatient();

  if (!patient) return null;
  const items = computeSummary(patient);

  const toneMap: Record<SummaryItem["tone"], "default" | "success" | "warning" | "danger"> = {
    primary: "default",
    success: "success",
    warning: "warning",
    danger: "danger",
  };

  const stats = items.map((item, index) => (
    <GlassStat
      key={item.title.en}
      icon={STAT_ICONS[index] ?? Activity}
      label={t(item.title, selectedLanguage)}
      value={t(item.value, selectedLanguage)}
      detail={t(item.supporting, selectedLanguage)}
      tone={toneMap[item.tone]}
    />
  ));

  return (
    <div className="space-y-2">
      {layout === "stack" ? (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={item.title.en} className={`w-[85%] max-w-xs ${STACK_OFFSET[index] ?? ""}`}>
              {stats[index]}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">{stats}</div>
      )}
      {patient.sample ? (
        <p className="text-xs text-white/50">
          Showing sample data for {patient.name} — add a real patient from the Hospital Portal to replace it.
        </p>
      ) : null}
    </div>
  );
}
