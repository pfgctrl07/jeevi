import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Loader2,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { t, type AppLanguage, type LabelSet } from "@/lib/data";

const STORAGE_KEY = "jeevitham-abha-connected";
const MOCK_ABHA_ID = "91-4820-7743-2196";

const connectSteps: Array<{ label: LabelSet; icon: typeof ScanSearch }> = [
  {
    label: { en: "Verifying ABHA ID", ta: "ABHA ID சரிபார்க்கிறது", hi: "ABHA ID सत्यापित हो रही है" },
    icon: ScanSearch,
  },
  {
    label: { en: "Fetching consent", ta: "ஒப்புதல் பெறுகிறது", hi: "सहमति ली जा रही है" },
    icon: ShieldCheck,
  },
  {
    label: { en: "Syncing vaccination records", ta: "தடுப்பூசி பதிவுகள் ஒத்திசைவு", hi: "टीकाकरण रिकॉर्ड सिंक हो रहे हैं" },
    icon: ShieldCheck,
  },
  {
    label: { en: "Syncing prescriptions", ta: "மருந்து பதிவுகள் ஒத்திசைவு", hi: "प्रिस्क्रिप्शन सिंक हो रहे हैं" },
    icon: FileText,
  },
];

const STEP_DURATION_MS = 700;

type Phase = "disconnected" | "connecting" | "connected";

function getInitialPhase(): Phase {
  if (typeof window === "undefined") {
    return "disconnected";
  }
  return window.localStorage.getItem(STORAGE_KEY) === "true"
    ? "connected"
    : "disconnected";
}

export function AbhaConnect({ language }: { language: AppLanguage }) {
  const [phase, setPhase] = useState<Phase>(getInitialPhase);
  const [activeStep, setActiveStep] = useState(0);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const runStep = (stepIndex: number) => {
    if (stepIndex >= connectSteps.length) {
      window.localStorage.setItem(STORAGE_KEY, "true");
      setSyncedAt(
        new Date().toLocaleString(language === "en" ? "en-IN" : language, {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setPhase("connected");
      return;
    }
    setActiveStep(stepIndex);
    timeoutRef.current = setTimeout(() => runStep(stepIndex + 1), STEP_DURATION_MS);
  };

  const startConnecting = () => {
    setPhase("connecting");
    runStep(0);
  };

  const disconnect = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSyncedAt(null);
    setPhase("disconnected");
  };

  return (
    <Card className="overflow-hidden border-border/70 bg-card/88">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-panel">
            <ScanSearch className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">ABHA Connect</h3>
            <p className="text-sm text-muted-foreground">
              Link your Ayushman Bharat Health Account to sync records
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "disconnected" ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 rounded-[1.6rem] border border-border/70 bg-background/72 p-6 text-center"
            >
              <p className="text-sm leading-6 text-muted-foreground">
                Connect ABHA to bring vaccination history and prescriptions into
                Jeevitham automatically. No paperwork, no manual entry.
              </p>
              <Button onClick={startConnecting}>Connect ABHA</Button>
            </motion.div>
          ) : null}

          {phase === "connecting" ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 rounded-[1.6rem] border border-border/70 bg-background/72 p-6"
            >
              {connectSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isDone = index < activeStep;
                const isActive = index === activeStep;

                return (
                  <div
                    key={t(step.label, language)}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3"
                  >
                    <div
                      className={
                        isDone
                          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500"
                          : isActive
                            ? "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary"
                            : "flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                      }
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <p
                      className={
                        isDone || isActive
                          ? "text-sm font-medium text-foreground"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {t(step.label, language)}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          ) : null}

          {phase === "connected" ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4 rounded-[1.6rem] border border-emerald-500/25 bg-emerald-500/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">ABHA Connected</p>
                    <p className="text-sm text-muted-foreground">
                      ABHA ID {MOCK_ABHA_ID}
                    </p>
                  </div>
                </div>
                {syncedAt ? (
                  <p className="text-xs text-muted-foreground">Last synced {syncedAt}</p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
                  <p className="text-sm text-muted-foreground">Vaccination records</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    DPT, MMR, Polio synced
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
                  <p className="text-sm text-muted-foreground">Prescriptions</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    Vitamin D drops synced
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={disconnect}>
                Disconnect ABHA
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
