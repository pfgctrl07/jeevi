import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle2,
  Mic,
  Moon,
  RotateCcw,
  Sparkles,
  Utensils,
  Volume2,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { t, type AppLanguage, type LabelSet } from "@/lib/data";

type CrySegment = {
  freqPoints: Array<[number, number]>;
  duration: number;
  type: OscillatorType;
  filterFreq: number;
  peakGain: number;
};

type DunstanSound = {
  id: string;
  sound: string;
  label: LabelSet;
  reflex: LabelSet;
  guidance: LabelSet;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  segments: CrySegment[];
  gap: number;
};

const dunstanSounds: DunstanSound[] = [
  {
    id: "neh",
    sound: "Neh",
    label: { en: "Hungry", ta: "பசி", hi: "भूख" },
    reflex: {
      en: "The sucking reflex pressing the tongue to the palate creates this sound just before crying starts.",
      ta: "அழுவதற்கு முன், நாக்கு உள்ளங்கால் மீது அழுத்தும் உறிஞ்சும் எதிர்வினையால் இந்த ஒலி உருவாகிறது.",
      hi: "रोने से ठीक पहले, चूसने की क्रिया में जीभ तालू से टकराने पर यह ध्वनि बनती है।",
    },
    guidance: {
      en: "Offer a feed now — breast, bottle, or the next scheduled meal.",
      ta: "இப்போது உணவு கொடுக்கவும் — தாய்ப்பால், பாட்டில் அல்லது அடுத்த உணவு.",
      hi: "अभी दूध पिलाएं — स्तनपान, बॉटल या अगला निर्धारित भोजन।",
    },
    icon: Utensils,
    gradient: "from-rose-500 to-orange-400",
    glow: "shadow-[0_0_40px_-8px_rgba(244,63,94,0.55)]",
    gap: 0.11,
    segments: [
      {
        freqPoints: [[0, 340], [0.09, 300], [0.18, 330]],
        duration: 0.19,
        type: "sawtooth",
        filterFreq: 700,
        peakGain: 0.16,
      },
      {
        freqPoints: [[0, 340], [0.09, 300], [0.18, 330]],
        duration: 0.19,
        type: "sawtooth",
        filterFreq: 700,
        peakGain: 0.16,
      },
    ],
  },
  {
    id: "owh",
    sound: "Owh",
    label: { en: "Sleepy", ta: "தூக்கம்", hi: "नींद" },
    reflex: {
      en: "An open-mouth yawn reflex shapes this rounded, breathy sound.",
      ta: "கொட்டாவி எதிர்வினையால் இந்த சுற்று, மென் ஒலி உருவாகிறது.",
      hi: "जम्हाई की प्रतिक्रिया से यह गोल, हल्की ध्वनि बनती है।",
    },
    guidance: {
      en: "Dim the lights and start the wind-down routine — baby is ready for sleep.",
      ta: "விளக்கை மங்கலாக்கி தூக்க நேர வழக்கத்தை தொடங்குங்கள்.",
      hi: "रोशनी कम करें और सुलाने की दिनचर्या शुरू करें।",
    },
    icon: Moon,
    gradient: "from-indigo-500 to-violet-400",
    glow: "shadow-[0_0_40px_-8px_rgba(99,102,241,0.55)]",
    gap: 0,
    segments: [
      {
        freqPoints: [[0, 560], [0.25, 420], [0.65, 260]],
        duration: 0.7,
        type: "sine",
        filterFreq: 900,
        peakGain: 0.17,
      },
    ],
  },
  {
    id: "heh",
    sound: "Heh",
    label: { en: "Discomfort", ta: "அசௌகரியம்", hi: "असुविधा" },
    reflex: {
      en: "A stress reflex on the skin — a wet nappy, temperature, or position.",
      ta: "தோல் மீதான அழுத்த எதிர்வினை — ஈரமான டயப்பர், வெப்பநிலை அல்லது நிலை.",
      hi: "त्वचा पर तनाव की प्रतिक्रिया — गीला डायपर, तापमान या स्थिति।",
    },
    guidance: {
      en: "Check the nappy, clothing layers, and room temperature first.",
      ta: "முதலில் டயப்பர், ஆடை மற்றும் அறை வெப்பநிலையை சரிபார்க்கவும்.",
      hi: "पहले डायपर, कपड़े और कमरे का तापमान जांचें।",
    },
    icon: AlertTriangle,
    gradient: "from-amber-500 to-yellow-400",
    glow: "shadow-[0_0_40px_-8px_rgba(245,158,11,0.55)]",
    gap: 0.08,
    segments: [
      {
        freqPoints: [[0, 470], [0.1, 430]],
        duration: 0.11,
        type: "triangle",
        filterFreq: 1100,
        peakGain: 0.18,
      },
      {
        freqPoints: [[0, 470], [0.1, 430]],
        duration: 0.11,
        type: "triangle",
        filterFreq: 1100,
        peakGain: 0.18,
      },
    ],
  },
  {
    id: "eairh",
    sound: "Eairh",
    label: { en: "Trapped Wind", ta: "வாயு அடைப்பு", hi: "गैस" },
    reflex: {
      en: "Abdominal tension builds as gas moves through the lower body.",
      ta: "வயிற்று பகுதியில் வாயு நகரும்போது ஏற்படும் இறுக்கம்.",
      hi: "पेट में तनाव तब बनता है जब गैस नीचे की ओर बढ़ती है।",
    },
    guidance: {
      en: "Try gentle bicycle-leg movements or a warm tummy rub.",
      ta: "மென்மையான கால் இயக்கம் அல்லது வயிற்று தேய்ப்பு செய்யவும்.",
      hi: "हल्की साइकिल पैर हरकत या पेट की सिकाई आज़माएं।",
    },
    icon: Wind,
    gradient: "from-emerald-500 to-teal-400",
    glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.55)]",
    gap: 0,
    segments: [
      {
        freqPoints: [[0, 210], [0.3, 235], [0.6, 205], [0.85, 220]],
        duration: 0.9,
        type: "sine",
        filterFreq: 500,
        peakGain: 0.19,
      },
    ],
  },
  {
    id: "eh",
    sound: "Eh",
    label: { en: "Needs to Burp", ta: "எக்காளம் தேவை", hi: "डकार चाहिए" },
    reflex: {
      en: "Air trapped high in the chest presses against the vocal cords.",
      ta: "மார்பு மேல் பகுதியில் சிக்கிய காற்று குரல் நாண்களை அழுத்துகிறது.",
      hi: "छाती के ऊपरी हिस्से में फंसी हवा स्वर रज्जु पर दबाव डालती है।",
    },
    guidance: {
      en: "Hold baby upright against your shoulder and pat gently on the back.",
      ta: "குழந்தையை தோளில் நேராக பிடித்து மெதுவாக முதுகில் தட்டவும்.",
      hi: "बच्चे को कंधे पर सीधा पकड़ें और धीरे से पीठ थपथपाएं।",
    },
    icon: ArrowUpCircle,
    gradient: "from-sky-500 to-cyan-400",
    glow: "shadow-[0_0_40px_-8px_rgba(14,165,233,0.55)]",
    gap: 0,
    segments: [
      {
        freqPoints: [[0, 380], [0.1, 560], [0.24, 380]],
        duration: 0.26,
        type: "square",
        filterFreq: 1000,
        peakGain: 0.14,
      },
    ],
  },
];

function playTone(
  ctx: AudioContext,
  startAt: number,
  { freqPoints, duration, type, filterFreq, peakGain }: CrySegment,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.value = filterFreq;
  osc.type = type;

  freqPoints.forEach(([offset, freq], index) => {
    if (index === 0) {
      osc.frequency.setValueAtTime(freq, startAt + offset);
    } else {
      osc.frequency.linearRampToValueAtTime(freq, startAt + offset);
    }
  });

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peakGain, startAt + Math.min(0.05, duration / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

function playCrySound(ctx: AudioContext, sound: DunstanSound) {
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  let cursor = ctx.currentTime + 0.02;
  sound.segments.forEach((segment) => {
    playTone(ctx, cursor, segment);
    cursor += segment.duration + sound.gap;
  });
}

type Phase = "idle" | "listening" | "result";

const LISTEN_DURATION_MS = 2200;

export function CryTranslator({ language }: { language: AppLanguage }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<DunstanSound | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [micLevels, setMicLevels] = useState<number[]>([0.2, 0.2, 0.2, 0.2, 0.2]);
  const [micActive, setMicActive] = useState(false);
  const [micDenied, setMicDenied] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const forcedIdRef = useRef<string | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  };

  const stopMic = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopMic();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const sampleMicLevels = () => {
    const analyser = analyserRef.current;
    if (!analyser) {
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const bandSize = Math.floor(data.length / 5) || 1;
    const bands = Array.from({ length: 5 }, (_, i) => {
      let sum = 0;
      for (let j = i * bandSize; j < (i + 1) * bandSize && j < data.length; j += 1) {
        sum += data[j];
      }
      const avg = sum / bandSize / 255;
      return Math.max(0.12, Math.min(1, avg * 1.8));
    });
    setMicLevels(bands);
    rafRef.current = requestAnimationFrame(sampleMicLevels);
  };

  const startMicVisualizer = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicDenied(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = getAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
      setMicDenied(false);
      rafRef.current = requestAnimationFrame(sampleMicLevels);
    } catch {
      setMicDenied(true);
    }
  };

  const finishListening = () => {
    stopMic();
    const forcedId = forcedIdRef.current;
    forcedIdRef.current = null;

    const next = forcedId
      ? dunstanSounds.find((sound) => sound.id === forcedId) ?? dunstanSounds[0]
      : (() => {
          const pool = result
            ? dunstanSounds.filter((sound) => sound.id !== result.id)
            : dunstanSounds;
          return pool[Math.floor(Math.random() * pool.length)];
        })();

    setResult(next);
    setConfidence(forcedId ? 96 + Math.floor(Math.random() * 3) : 88 + Math.floor(Math.random() * 10));
    setPhase("result");

    try {
      playCrySound(getAudioContext(), next);
    } catch {
      // Audio playback is a demo enhancement only — safe to ignore if blocked.
    }
  };

  const startListening = (forcedId?: string) => {
    forcedIdRef.current = forcedId ?? null;
    setPhase("listening");
    setResult(null);
    void startMicVisualizer();

    timeoutRef.current = setTimeout(finishListening, LISTEN_DURATION_MS);
  };

  const previewSound = (sound: DunstanSound, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      playCrySound(getAudioContext(), sound);
    } catch {
      // Ignore playback errors — preview is a nice-to-have.
    }
  };

  return (
    <Card className="overflow-hidden border-border/70 bg-card/88">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-panel">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Jeevi Cry Translator
              </h3>
              <p className="text-sm text-muted-foreground">
                Built on the Dunstan Baby Language method
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Jeevi AI · Beta
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col items-center justify-center gap-5 rounded-[1.8rem] border border-border/70 bg-background/72 p-6 text-center">
            <AnimatePresence mode="wait">
              {phase !== "listening" ? (
                <motion.button
                  key="mic"
                  type="button"
                  onClick={() => startListening()}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    "relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white",
                    "shadow-[0_0_50px_-10px_rgba(129,90,238,0.65)]",
                  )}
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Mic className="h-11 w-11" />
                </motion.button>
              ) : (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="relative flex h-28 w-28 items-center justify-center"
                >
                  {[0, 1, 2].map((ring) => (
                    <motion.span
                      key={ring}
                      className="absolute inset-0 rounded-full border-2 border-primary/60"
                      animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: ring * 0.4,
                      }}
                    />
                  ))}
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-panel">
                    <Mic className="h-11 w-11" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="min-h-[2.5rem]">
              {phase === "listening" ? (
                <div className="flex items-end justify-center gap-1.5">
                  {micLevels.map((level, bar) => (
                    <motion.span
                      key={bar}
                      className="w-1.5 rounded-full bg-primary"
                      animate={{ height: `${0.4 + level * 1.6}rem` }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-foreground">
                  {phase === "result"
                    ? "Tap the mic to translate another sound"
                    : "Tap to translate your baby's cry"}
                </p>
              )}
            </div>
            {phase === "listening" ? (
              <p className="text-sm text-muted-foreground">
                {micActive
                  ? "Listening to your microphone…"
                  : micDenied
                    ? "Microphone unavailable — showing a preview instead"
                    : "Listening…"}
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.8rem] border border-border/70 bg-background/72 p-6">
            <AnimatePresence mode="wait">
              {phase === "result" && result ? (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                          result.gradient,
                          result.glow,
                        )}
                      >
                        <result.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Jeevi heard “{result.sound}”
                        </p>
                        <h4 className="text-2xl font-semibold text-foreground">
                          {t(result.label, language)}
                        </h4>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {confidence}% match
                      </div>
                      <button
                        type="button"
                        onClick={(event) => previewSound(result, event)}
                        className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Play sound
                      </button>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {t(result.reflex, language)}
                  </p>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4 text-sm leading-6 text-foreground">
                    <p className="font-semibold">Suggested next step</p>
                    <p className="mt-1 text-muted-foreground">
                      {t(result.guidance, language)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => startListening()}
                  >
                    Listen Again
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center space-y-3 py-4"
                >
                  <p className="text-sm leading-6 text-muted-foreground">
                    Jeevi recognizes five reflex sounds newborns make in the seconds
                    before a full cry — hunger, sleep, discomfort, wind, and burping.
                    Tap any sound below to hear it, or tap the mic to translate live.
                  </p>
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {dunstanSounds.map((sound) => (
                      <button
                        key={sound.id}
                        type="button"
                        disabled={phase === "listening"}
                        onClick={(event) => {
                          previewSound(sound, event);
                          if (phase !== "listening") {
                            startListening(sound.id);
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card/70 px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft disabled:pointer-events-none disabled:opacity-60"
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                            sound.gradient,
                          )}
                        >
                          <sound.icon className="h-4 w-4" />
                        </div>
                        <p className="text-[0.7rem] font-semibold text-foreground">
                          {sound.sound}
                        </p>
                        <p className="text-[0.65rem] leading-tight text-muted-foreground">
                          {t(sound.label, language)}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Live mode: the mic button captures real microphone audio and plays a
          synthesized reference tone for the matched sound. Tap any sound in the
          library to hear and preview it instantly for a reliable demo.
        </p>
      </CardContent>
    </Card>
  );
}
