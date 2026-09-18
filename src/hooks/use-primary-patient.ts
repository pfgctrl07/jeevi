import { useEffect, useState } from "react";
import { api, type Patient } from "@/lib/api";

// The app doesn't have per-user accounts yet (tracked in the roadmap), so
// "the current family's child" is the first patient record. Centralizing
// that assumption here means only one place needs updating once real
// accounts exist.
export function usePrimaryPatient() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getPatients()
      .then((patients) => {
        if (!cancelled) setPatient(patients[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setPatient(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { patient, loading };
}
