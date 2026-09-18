import { useEffect, useState } from "react";
import { Pill, Stethoscope, Syringe, Users } from "lucide-react";
import { GlassStat } from "@/components/ui/glass-chip";
import { api, type Patient } from "@/lib/api";

const STACK_OFFSET = ["ml-0", "ml-6 sm:ml-10", "ml-0"];

// Hospital and Doctor logins manage many patients, not one child — so their
// hero shows real facility-wide counts instead of borrowing one arbitrary
// patient's Next Vaccine / Next Visit / Health Status.
export function OrgSummary({
  variant,
  layout = "row",
}: {
  variant: "hospital" | "doctor";
  layout?: "row" | "stack";
}) {
  const [patients, setPatients] = useState<Patient[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getPatients()
      .then((data) => {
        if (!cancelled) setPatients(data);
      })
      .catch(() => {
        if (!cancelled) setPatients([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!patients) return null;

  const vaccinesDue = patients.reduce(
    (sum, p) => sum + p.vaccinationHistory.filter((v) => v.status === "upcoming").length,
    0,
  );
  const doctorCount = new Set(patients.map((p) => p.doctor).filter(Boolean)).size;
  const prescriptionCount = patients.reduce((sum, p) => sum + (p.prescriptions?.length ?? 0), 0);
  const sampleCount = patients.filter((p) => p.sample).length;

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: String(patients.length),
      detail: sampleCount > 0 ? `${sampleCount} sample, ${patients.length - sampleCount} real` : "on record",
    },
    {
      icon: Syringe,
      label: "Vaccines Due",
      value: String(vaccinesDue),
      detail: "across all patients",
    },
    variant === "hospital"
      ? { icon: Stethoscope, label: "Doctors Assigned", value: String(doctorCount), detail: "on this roster" }
      : { icon: Pill, label: "Prescriptions Written", value: String(prescriptionCount), detail: "on record" },
  ];

  if (layout === "stack") {
    return (
      <div className="flex flex-col gap-3">
        {stats.map((s, i) => (
          <div key={s.label} className={`w-[85%] max-w-xs ${STACK_OFFSET[i] ?? ""}`}>
            <GlassStat icon={s.icon} label={s.label} value={s.value} detail={s.detail} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <GlassStat key={s.label} icon={s.icon} label={s.label} value={s.value} detail={s.detail} />
      ))}
    </div>
  );
}
