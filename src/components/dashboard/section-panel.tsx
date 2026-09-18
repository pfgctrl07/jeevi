import { EmptyState } from "./empty-state";
import { moduleSections, t, type SectionKey } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";
import { LearningPrototype } from "./learning-prototype";
import { VaccinationDashboard } from "./vaccination-dashboard";
import { HospitalDashboard } from "./hospital-dashboard";
import { NutritionAnalyzer } from "./nutrition-analyzer";
import { DoctorDashboard } from "./doctor-dashboard";
import { AppointmentsPanel } from "./appointments-panel";

const liveSections: Partial<Record<SectionKey, true>> = {
  dashboard: true,
  learning: true,
  vaccination: true,
  hospital: true,
  nutrition: true,
  doctor: true,
  appointments: true,
};

export function SectionPanel({ section }: { section: SectionKey }) {
  const { selectedLanguage } = useAppState();
  const meta = moduleSections[section];
  const Icon = meta.icon;

  return (
    <section className="space-y-3 rounded-md border border-border/70 bg-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-primary" />
        <div>
          <h2 className="text-base font-semibold text-foreground">{t(meta.title, selectedLanguage)}</h2>
          <p className="text-sm text-muted-foreground">{t(meta.description, selectedLanguage)}</p>
        </div>
      </div>

      {section === "learning" ? <LearningPrototype language={selectedLanguage} /> : null}
      {section === "dashboard" || section === "vaccination" ? <VaccinationDashboard /> : null}
      {section === "hospital" ? <HospitalDashboard /> : null}
      {section === "nutrition" ? <NutritionAnalyzer /> : null}
      {section === "doctor" ? <DoctorDashboard /> : null}
      {section === "appointments" ? <AppointmentsPanel /> : null}

      {!liveSections[section] ? (
        <div className="divide-y divide-border/70 rounded-md border border-border/70">
          {meta.highlights.map((item) => {
            const HighlightIcon = item.icon;
            return (
              <div key={t(item.title, selectedLanguage)} className="flex items-center gap-3 px-4 py-3">
                <HighlightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t(item.title, selectedLanguage)}</p>
                  <p className="text-sm text-muted-foreground">{t(item.detail, selectedLanguage)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {meta.emptyState ? (
        <EmptyState
          title={t(meta.emptyState.title, selectedLanguage)}
          description={t(meta.emptyState.description, selectedLanguage)}
        />
      ) : null}
    </section>
  );
}
