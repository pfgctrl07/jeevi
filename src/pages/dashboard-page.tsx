import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { TopNav } from "@/components/dashboard/top-nav";
import { Modal } from "@/components/ui/modal";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { LiveSummary } from "@/components/dashboard/live-summary";
import { OrgSummary } from "@/components/dashboard/org-summary";
import { ListRow, ListSection } from "@/components/ui/list";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/contexts/app-state-context";
import { defaultSectionForRole, moduleSections, priorityCards, t, tx, type SectionKey } from "@/lib/data";
import { getModalContent } from "@/components/dashboard/modal-content";
import { JeeviChat } from "@/components/dashboard/jeevi-chat";
import { getStoredValue, setStoredValue } from "@/lib/storage";
import { usePrimaryPatient } from "@/hooks/use-primary-patient";

const ONBOARDING_KEY = "jeevitham-onboarding-complete";

const onboardingSteps = [
  {
    title: "Parent Information",
    detail: "Name, phone number, and preferred language are confirmed first.",
  },
  {
    title: "Child Information",
    detail: "Age, date of birth, and basic profile details are collected.",
  },
  {
    title: "Medical Details",
    detail: "Blood group, allergies, and important conditions are saved clearly.",
  },
  {
    title: "Vaccination History",
    detail: "Previous doses and upcoming milestones are prepared in a timeline.",
  },
  {
    title: "Setup Complete",
    detail: "Jeevitham is ready to guide today’s care in simple steps.",
  },
];

const assistantPrompts = [
  "Can my child eat chocolate biscuit every day?",
  "What should I do before the MMR vaccine?",
];

export function DashboardPage() {
  const {
    activeSection,
    setActiveSection,
    selectedLanguage,
    selectedRole,
    isAssistantOpen,
    setAssistantOpen,
  } = useAppState();
  const [openModal, setOpenModal] = useState<SectionKey | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (getStoredValue(ONBOARDING_KEY) !== "true") {
      setShowOnboarding(true);
    }
  }, []);

  const currentModal = useMemo(
    () => (openModal ? getModalContent(openModal, selectedLanguage) : null),
    [openModal, selectedLanguage],
  );

  const activeHeading = moduleSections[activeSection];

  const { patient: primaryPatient } = usePrimaryPatient();
  const liveDescription = primaryPatient?.doctor
    ? { en: `${primaryPatient.doctor} — next visit`, ta: `${primaryPatient.doctor} — அடுத்த சந்திப்பு`, hi: `${primaryPatient.doctor} — अगली मुलाकात` }
    : null;
  const liveStatus = primaryPatient?.nextAppointment
    ? (() => {
        const formatted = new Date(primaryPatient.nextAppointment).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return { en: formatted, ta: formatted, hi: formatted };
      })()
    : null;
  const liveCards = priorityCards
    .filter((card) => card.roles.includes(selectedRole))
    .map((card) =>
      card.id === "appointments" && selectedRole === "parent" && liveDescription && liveStatus
        ? { ...card, description: liveDescription, status: liveStatus }
        : card,
    );

  // The quick-actions list and activity feed are the role's home-screen
  // chrome — they belong on the landing section only. Anywhere else, the
  // visitor already chose a focused task, so show just that task, full-width.
  const isLanding = activeSection === defaultSectionForRole[selectedRole];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <TopNav />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* Hero — asymmetric two-column, same bold gradient + glass language as the sign-in page. */}
        <section className="auth-hero relative overflow-hidden rounded-2xl px-5 py-8 sm:px-8 sm:py-10">
          <img
            src="/jeevitham-logo.jpeg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-16 hidden w-[26rem] rounded-full opacity-[0.1] mix-blend-luminosity lg:block"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                {t(activeHeading.title, selectedLanguage)}
              </span>
              <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {tx(
                  selectedRole === "parent"
                    ? "Welcome back, Priya 👋"
                    : selectedRole === "doctor"
                      ? "Welcome back, Care Doctor 👋"
                      : "Welcome back, Hospital Desk 👋",
                  selectedLanguage,
                )}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                {tx(
                  selectedRole === "parent"
                    ? "See the next vaccine, next appointment, health status, and urgent care in one view."
                    : selectedRole === "doctor"
                      ? "Follow vaccinations, appointments, and prescriptions without admin-style clutter."
                      : "Manage campaigns, care teams, and summaries with simple healthcare-first screens.",
                  selectedLanguage,
                )}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAssistantOpen(true)}
                  className="inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-white/90"
                >
                  {tx("Ask Jeevi AI", selectedLanguage)}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
              {selectedRole === "parent" ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {assistantPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setAssistantOpen(true)}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md transition hover:bg-white/20"
                    >
                      {tx(prompt, selectedLanguage)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* At a glance: one child's record for a parent, facility-wide counts for staff — never a stranger's child under a staff login. */}
            {selectedRole === "parent" ? (
              <LiveSummary layout="stack" />
            ) : (
              <OrgSummary variant={selectedRole} layout="stack" />
            )}
          </div>
        </section>

        {isLanding ? (
          /* Home view: quick-actions list + focused panel, activity feed alongside. */
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="space-y-6">
              <ListSection
                title={tx("What should I do next?", selectedLanguage)}
                description={tx("Tap any item for details.", selectedLanguage)}
              >
                {liveCards.map((feature) => (
                  <ListRow
                    key={feature.id}
                    icon={feature.icon}
                    label={t(feature.title, selectedLanguage)}
                    detail={t(feature.description, selectedLanguage)}
                    onClick={() => {
                      setActiveSection(feature.id);
                      setOpenModal(feature.id);
                    }}
                    trailing={<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  />
                ))}
              </ListSection>

              <SectionPanel section={activeSection} />
            </div>

            <div className="space-y-6">
              <ActivityTimeline />
            </div>
          </div>
        ) : (
          /* Task view: the visitor already chose what to do — show only that, full-width. */
          <SectionPanel section={activeSection} />
        )}
      </main>

      <Modal
        open={Boolean(currentModal)}
        onOpenChange={(open) => {
          if (!open) {
            setOpenModal(null);
          }
        }}
        title={currentModal?.title ?? ""}
        description={currentModal?.description ?? ""}
      >
        {currentModal?.body ?? null}
      </Modal>

      <Modal
        open={showOnboarding}
        onOpenChange={(open) => {
          setShowOnboarding(open);
          if (!open) {
            setStoredValue(ONBOARDING_KEY, "true");
          }
        }}
        title={tx("First Login Setup", selectedLanguage)}
        description={tx("A simple onboarding flow prepares the family profile without overwhelming the caregiver.", selectedLanguage)}
      >
        <div className="space-y-3">
          {onboardingSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-md border border-border/70 bg-background px-4 py-3"
            >
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-foreground">{tx(step.title, selectedLanguage)}</p>
                <p className="text-sm leading-6 text-muted-foreground">{tx(step.detail, selectedLanguage)}</p>
              </div>
            </div>
          ))}

          <Button
            className="mt-2 w-full"
            onClick={() => {
              setStoredValue(ONBOARDING_KEY, "true");
              setShowOnboarding(false);
            }}
          >
            {tx("Continue to Jeevitham", selectedLanguage)}
          </Button>
        </div>
      </Modal>

      <Modal
        open={isAssistantOpen}
        onOpenChange={setAssistantOpen}
        title={tx("Jeevi AI Assistant", selectedLanguage)}
        description={tx("Real AI guidance for nutrition, parenting, vaccination, child health education, and next steps.", selectedLanguage)}
      >
        <JeeviChat />
      </Modal>
    </div>
  );
}
