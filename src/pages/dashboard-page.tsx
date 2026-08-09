import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenText,
  Bot,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { FeatureCard } from "@/components/dashboard/feature-card";
import { Header } from "@/components/dashboard/header";
import { Modal } from "@/components/ui/modal";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/contexts/app-state-context";
import {
  moduleSections,
  priorityCards,
  recentActivities,
  summaryItems,
  t,
  tx,
  type SectionKey,
} from "@/lib/data";
import { getModalContent } from "@/components/dashboard/modal-content";

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
  "Show me simple foods for better weight gain.",
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
    if (window.localStorage.getItem(ONBOARDING_KEY) !== "true") {
      setShowOnboarding(true);
    }
  }, []);

  const currentModal = useMemo(
    () => (openModal ? getModalContent(openModal, selectedLanguage) : null),
    [openModal, selectedLanguage],
  );

  const activeHeading = moduleSections[activeSection];
  const ActiveIcon = activeHeading.icon;
  const primarySummaries = summaryItems.slice(0, 3);

  return (
    <main className="min-h-screen bg-background px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 lg:flex-row">
        <Sidebar />

        <div className="flex-1 space-y-5">
          <Header />

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-border/70 bg-card/88 p-6 shadow-soft"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-sm font-medium text-primary">
                  <ActiveIcon className="h-4 w-4" />
                  {t(activeHeading.title, selectedLanguage)}
                </div>
                <h2 className="text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                  {tx(selectedRole === "parent" ? "Family healthcare made simple for today." : selectedRole === "doctor" ? "Clear care workflows for every child visit." : "A cleaner maternal and child healthcare workspace.", selectedLanguage)}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {tx(selectedRole === "parent" ? "See the next vaccine, next appointment, emergency help, and health learning within a few seconds." : "Important tasks stay visible first, with simple wording and less dashboard clutter.", selectedLanguage)}
                </p>
              </div>

              <div className="grid gap-3 rounded-[1.6rem] border border-border/70 bg-background/72 p-4 sm:grid-cols-2 xl:min-w-[380px]">
                {primarySummaries.slice(0, 2).map((item) => (
                  <div key={item.title.en} className="rounded-2xl bg-card/80 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t(item.title, selectedLanguage)}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {t(item.value, selectedLanguage)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(item.supporting, selectedLanguage)}
                    </p>
                  </div>
                ))}
                <Button
                  className="sm:col-span-2"
                  onClick={() => setAssistantOpen(true)}
                >
                  {tx("Ask Jeevi AI", selectedLanguage)}
                </Button>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-4 md:grid-cols-3">
            {primarySummaries.map((item, index) => (
              <StatCard
                key={item.title.en}
                item={item}
                index={index}
                language={selectedLanguage}
              />
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                    {tx(selectedRole === "parent" ? "What should I do next?" : selectedRole === "doctor" ? "Today’s care priorities" : "Hospital care priorities", selectedLanguage)}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {tx(selectedRole === "parent" ? "The most important actions stay large, simple, and easy to tap." : "Priority care actions are shown first with less visual noise.", selectedLanguage)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {priorityCards.map((feature, index) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  index={index}
                  language={selectedLanguage}
                  onOpen={(featureId) => {
                    setActiveSection(featureId);
                    setOpenModal(featureId);
                  }}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <SectionPanel section={activeSection} />

            <div className="space-y-4">
              <Card className="border-border/70 bg-card/88">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{tx("Emergency Access", selectedLanguage)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tx("The fastest way to get help should always stay visible.", selectedLanguage)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
                      <p className="text-sm text-muted-foreground">{tx("Ambulance", selectedLanguage)}</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">108</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
                      <p className="text-sm text-muted-foreground">{tx("Women Helpline", selectedLanguage)}</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">181</p>
                    </div>
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={() => {
                        setActiveSection("emergency");
                        setOpenModal("emergency");
                      }}
                    >
                      {tx("Open Emergency Contacts", selectedLanguage)}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/88">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{tx("Jeevi AI", selectedLanguage)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tx("Quick help for vaccines, food, and simple next steps.", selectedLanguage)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {assistantPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setAssistantOpen(true)}
                        className="w-full rounded-2xl border border-border/70 bg-background/72 px-4 py-3 text-left text-sm text-foreground transition hover:bg-muted"
                      >
                {tx(prompt, selectedLanguage)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <ActivityTimeline items={recentActivities} language={selectedLanguage} />

            <Card className="border-border/70 bg-card/88">
              <CardContent className="space-y-4 p-6">
                <div>
                    <h3 className="text-xl font-semibold text-foreground">{tx("Popular Services", selectedLanguage)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {tx("The most useful family healthcare paths stay visible even on a first visit.", selectedLanguage)}
                  </p>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection("appointments")}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:bg-muted"
                  >
                    <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tx("Appointments", selectedLanguage)}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {tx("Manage upcoming doctor visits and follow-ups.", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("hospitals")}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:bg-muted"
                  >
                    <Stethoscope className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tx("Doctor Information", selectedLanguage)}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {tx("Find care centers, contacts, and support nearby.", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("learning")}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:bg-muted"
                  >
                    <BookOpenText className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tx("Health Learning", selectedLanguage)}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {tx("Open pregnancy, feeding, and child care prototype lessons.", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("vaccination")}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:bg-muted"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tx("Vaccination", selectedLanguage)}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {tx("Review vaccine schedule and due dates clearly.", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection("records")}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:bg-muted"
                  >
                    <Bot className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{tx("Patient Services", selectedLanguage)}</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {tx("Keep records, prescriptions, and notes together.", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/70 bg-card/88">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{tx("Learning This Week", selectedLanguage)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {tx("Prototype lesson shelves make the learning area look real without streaming video.", selectedLanguage)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setActiveSection("learning")}
                >
                  {tx("Open Learning Hub", selectedLanguage)}
                  <BookOpenText className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/88">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{tx("Need Help Now?", selectedLanguage)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {tx("Use emergency contacts first, then continue with care, learning, or appointments.", selectedLanguage)}
                  </p>
                </div>

                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    setActiveSection("emergency");
                    setOpenModal("emergency");
                  }}
                >
                  {tx("Open Emergency", selectedLanguage)}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

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
            window.localStorage.setItem(ONBOARDING_KEY, "true");
          }
        }}
        title={tx("First Login Setup", selectedLanguage)}
        description={tx("A simple onboarding flow prepares the family profile without overwhelming the caregiver.", selectedLanguage)}
      >
        <div className="space-y-3">
          {onboardingSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 py-3"
            >
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
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
              window.localStorage.setItem(ONBOARDING_KEY, "true");
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
        description={tx("Friendly multilingual guidance for nutrition, parenting, vaccination, child health education, and next steps.", selectedLanguage)}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm leading-7 text-foreground">
            {tx("Hello, I am Jeevi. I can explain vaccine timing, child feeding, common symptoms, growth milestones, and safe next steps in simple language.", selectedLanguage)}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border/70 bg-background/72 shadow-none">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Bot className="h-5 w-5 text-primary" />
                  <p className="font-semibold">{tx("Sample question", selectedLanguage)}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tx("My child missed one vaccine. What should I do next?", selectedLanguage)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-background/72 shadow-none">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-foreground">
                  <HeartPulse className="h-5 w-5 text-emerald-400" />
                  <p className="font-semibold">{tx("Sample answer", selectedLanguage)}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tx("Do not worry. Open Vaccination Timeline, check the missed dose, and contact the nearest care center shown in Hospitals.", selectedLanguage)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <p className="font-semibold">{tx("Multilingual-ready architecture", selectedLanguage)}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {tx("Navigation, labels, buttons, and help content are now structured to scale across English, Tamil, and Hindi.", selectedLanguage)}
            </p>
          </div>
        </div>
      </Modal>
    </main>
  );
}
