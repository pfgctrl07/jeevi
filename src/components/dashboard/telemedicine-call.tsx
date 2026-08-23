import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  PhoneOff,
  SendHorizontal,
  Stethoscope,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type AppLanguage } from "@/lib/data";

type ChatMessage = {
  id: string;
  from: "doctor" | "parent";
  text: string;
};

const seedMessages: ChatMessage[] = [
  { id: "seed-1", from: "doctor", text: "Hello! I've pulled up Anika's growth and feeding notes." },
  { id: "seed-2", from: "doctor", text: "How has the fever been since yesterday?" },
];

type Phase = "idle" | "connecting" | "connected" | "ended";

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function TelemedicineCall({ language: _language }: { language: AppLanguage }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [draft, setDraft] = useState("");

  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const joinCall = () => {
    setPhase("connecting");
    connectTimeoutRef.current = setTimeout(() => {
      setPhase("connected");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }, 1800);
  };

  const endCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase("ended");
  };

  const restartFlow = () => {
    setMessages(seedMessages);
    setSeconds(0);
    setPhase("idle");
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `parent-${Date.now()}`, from: "parent", text }]);
    setDraft("");
  };

  return (
    <Card className="overflow-hidden border-border/70 bg-card/88">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-panel">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Telemedicine</h3>
            <p className="text-sm text-muted-foreground">
              25 July · 6:00 PM with Dr. Priya Menon
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 rounded-[1.8rem] border border-border/70 bg-background/72 p-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Dr. Priya Menon</p>
                <p className="text-sm text-muted-foreground">
                  Feeding and fever follow-up · demo consultation
                </p>
              </div>
              <Button onClick={joinCall}>Join Call</Button>
            </motion.div>
          ) : null}

          {phase === "connecting" ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 rounded-[1.8rem] border border-border/70 bg-background/72 p-10 text-center"
            >
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                {[0, 1, 2].map((ring) => (
                  <motion.span
                    key={ring}
                    className="absolute inset-0 rounded-full border-2 border-primary/60"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: ring * 0.35 }}
                  />
                ))}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                  <Video className="h-8 w-8" />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">
                Connecting to Dr. Priya Menon…
              </p>
            </motion.div>
          ) : null}

          {phase === "connected" ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="space-y-3">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-400/20"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative flex flex-col items-center gap-3 text-white">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-semibold backdrop-blur">
                      PM
                    </div>
                    <p className="text-sm font-medium">Dr. Priya Menon</p>
                  </div>
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    {formatTimer(seconds)}
                  </div>
                  <div className="absolute bottom-4 right-4 h-16 w-24 overflow-hidden rounded-xl border border-white/20 bg-slate-700/80 backdrop-blur">
                    {cameraOn ? (
                      <div className="flex h-full items-center justify-center text-xs text-white/80">
                        You
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/60">
                        <VideoOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMicOn((prev) => !prev)}
                    className={cn(!micOn && "border-danger/40 bg-danger/10 text-danger")}
                    aria-label="Toggle microphone"
                  >
                    {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCameraOn((prev) => !prev)}
                    className={cn(!cameraOn && "border-danger/40 bg-danger/10 text-danger")}
                    aria-label="Toggle camera"
                  >
                    {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <Button variant="danger" onClick={endCall}>
                    <PhoneOff className="h-4 w-4" />
                    End Call
                  </Button>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-[1.6rem] border border-border/70 bg-background/72 p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">Consultation chat</p>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                        message.from === "doctor"
                          ? "bg-card/80 text-foreground"
                          : "ml-auto bg-primary/15 text-foreground",
                      )}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") sendMessage();
                    }}
                    placeholder="Type a message"
                    className="h-11 flex-1 rounded-xl border border-border/70 bg-card/70 px-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <Button size="icon" onClick={sendMessage} aria-label="Send message">
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}

          {phase === "ended" ? (
            <motion.div
              key="ended"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 rounded-[1.8rem] border border-border/70 bg-background/72 p-8 text-center"
            >
              <p className="font-semibold text-foreground">Call ended</p>
              <p className="text-sm text-muted-foreground">
                Duration {formatTimer(seconds)} · A consultation summary has been saved
                to Patient Services.
              </p>
              <Button variant="outline" onClick={restartFlow}>
                Start Another Demo Call
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <p className="text-xs leading-5 text-muted-foreground">
          Demo mode: this is a simulated call experience for presentation purposes — no
          real video stream or camera access is used.
        </p>
      </CardContent>
    </Card>
  );
}
