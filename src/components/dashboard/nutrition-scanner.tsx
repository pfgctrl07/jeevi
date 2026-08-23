import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { t, type AppLanguage, type LabelSet } from "@/lib/data";

type FoodTone = "success" | "warning" | "primary";

type FoodResult = {
  id: string;
  name: LabelSet;
  score: number;
  tone: FoodTone;
  tags: LabelSet[];
  tip: LabelSet;
};

const foodCatalog: FoodResult[] = [
  {
    id: "banana",
    name: { en: "Banana", ta: "வாழைப்பழம்", hi: "केला" },
    score: 88,
    tone: "success",
    tags: [
      { en: "Good potassium", ta: "நல்ல பொட்டாசியம்", hi: "अच्छा पोटैशियम" },
      { en: "Natural sugars", ta: "இயற்கை சர்க்கரை", hi: "प्राकृतिक शक्कर" },
    ],
    tip: {
      en: "Great for energy between meals.",
      ta: "உணவுக்கு இடையே ஆற்றலுக்கு சிறந்தது.",
      hi: "भोजन के बीच ऊर्जा के लिए बढ़िया।",
    },
  },
  {
    id: "chocolate-biscuit",
    name: { en: "Chocolate Biscuit", ta: "Chocolate biscuit", hi: "चॉकलेट बिस्किट" },
    score: 32,
    tone: "warning",
    tags: [
      { en: "High sugar", ta: "சர்க்கரை அதிகம்", hi: "शुगर ज़्यादा" },
      { en: "Low protein", ta: "புரதம் குறைவு", hi: "प्रोटीन कम" },
    ],
    tip: {
      en: "Avoid daily use — keep as an occasional treat.",
      ta: "தினமும் வேண்டாம் — எப்போதாவது மட்டும்.",
      hi: "रोज़ न दें — कभी-कभार ही दें।",
    },
  },
  {
    id: "dal-rice",
    name: { en: "Dal & Rice", ta: "பருப்பு சாதம்", hi: "दाल चावल" },
    score: 95,
    tone: "success",
    tags: [
      { en: "High protein", ta: "புரதம் அதிகம்", hi: "प्रोटीन ज़्यादा" },
      { en: "Easy to digest", ta: "எளிதில் ஜீரணம்", hi: "आसानी से पचता है" },
    ],
    tip: {
      en: "A well-balanced main meal for growing toddlers.",
      ta: "வளரும் குழந்தைகளுக்கு சீரான முக்கிய உணவு.",
      hi: "बढ़ते बच्चों के लिए संतुलित मुख्य भोजन।",
    },
  },
  {
    id: "milk",
    name: { en: "Milk", ta: "பால்", hi: "दूध" },
    score: 90,
    tone: "success",
    tags: [
      { en: "Calcium rich", ta: "கால்சியம் அதிகம்", hi: "कैल्शियम भरपूर" },
      { en: "Supports bone growth", ta: "எலும்பு வளர்ச்சிக்கு உதவும்", hi: "हड्डी विकास में मदद" },
    ],
    tip: {
      en: "Offer as part of a balanced daily diet.",
      ta: "தினசரி சீரான உணவின் ஒரு பகுதியாக கொடுக்கவும்.",
      hi: "संतुलित दैनिक आहार के हिस्से के रूप में दें।",
    },
  },
  {
    id: "boiled-egg",
    name: { en: "Boiled Egg", ta: "வேகவைத்த முட்டை", hi: "उबला अंडा" },
    score: 93,
    tone: "success",
    tags: [
      { en: "High protein", ta: "புரதம் அதிகம்", hi: "प्रोटीन ज़्यादा" },
      { en: "Rich in choline", ta: "கோலின் நிறைந்தது", hi: "कोलीन से भरपूर" },
    ],
    tip: {
      en: "An excellent breakfast protein source.",
      ta: "காலை உணவுக்கு சிறந்த புரத ஆதாரம்.",
      hi: "नाश्ते के लिए बेहतरीन प्रोटीन स्रोत।",
    },
  },
  {
    id: "fruit-juice",
    name: { en: "Packaged Fruit Juice", ta: "பாக்கெட் பழரசம்", hi: "पैकेज्ड फ्रूट जूस" },
    score: 45,
    tone: "warning",
    tags: [
      { en: "High sugar", ta: "சர்க்கரை அதிகம்", hi: "शुगर ज़्यादा" },
      { en: "Low fiber", ta: "நார்ச்சத்து குறைவு", hi: "फाइबर कम" },
    ],
    tip: {
      en: "Prefer whole fruit over juice when possible.",
      ta: "முடிந்தால் ரசத்தை விட முழு பழத்தை தேர்வு செய்யவும்.",
      hi: "जब संभव हो जूस की जगह पूरा फल दें।",
    },
  },
];

function toneClasses(tone: FoodTone) {
  switch (tone) {
    case "success":
      return {
        badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
        box: "border-emerald-500/20 bg-emerald-500/10",
      };
    case "warning":
      return {
        badge: "border-amber-500/30 bg-amber-500/10 text-amber-500",
        box: "border-amber-500/20 bg-amber-500/10",
      };
    default:
      return {
        badge: "border-primary/30 bg-primary/10 text-primary",
        box: "border-primary/20 bg-primary/10",
      };
  }
}

function hashPick(seed: string): FoodResult {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return foodCatalog[hash % foodCatalog.length];
}

type Phase = "idle" | "scanning" | "result";

export function NutritionScanner({ language }: { language: AppLanguage }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<FoodResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const revealFood = (food: FoodResult, delay: number) => {
    setPhase("scanning");
    setResult(null);
    timeoutRef.current = setTimeout(() => {
      setResult(food);
      setPhase("result");
    }, delay);
  };

  const scanQuickFood = (food: FoodResult) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    revealFood(food, 900);
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    revealFood(hashPick(`${file.name}-${file.size}`), 1400);
  };

  return (
    <Card className="overflow-hidden border-border/70 bg-card/88">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-panel">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Jeevi Nutrition Scanner
            </h3>
            <p className="text-sm text-muted-foreground">
              Scan a food photo for an instant child-suitability score
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-[1.8rem] border border-border/70 bg-background/72 p-6">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/70 bg-card/60 px-4 py-8 text-center transition hover:border-primary/40">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected food"
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Upload or capture a food photo
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG or PNG — analyzed instantly, on-device
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={onFileSelected}
              />
            </label>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick scan
              </p>
              <div className="flex flex-wrap gap-2">
                {foodCatalog.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => scanQuickFood(food)}
                    className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-muted"
                  >
                    {t(food.name, language)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-border/70 bg-background/72 p-6">
            <AnimatePresence mode="wait">
              {phase === "scanning" ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center"
                >
                  <div className="relative h-16 w-16">
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-primary/60"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-white">
                      <Sparkles className="h-7 w-7" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">Analyzing food…</p>
                </motion.div>
              ) : null}

              {phase === "result" && result ? (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Scan result
                      </p>
                      <h4 className="text-xl font-semibold text-foreground">
                        {t(result.name, language)}
                      </h4>
                    </div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold",
                        toneClasses(result.tone).badge,
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {result.score}/100
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span
                        key={t(tag, language)}
                        className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {t(tag, language)}
                      </span>
                    ))}
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-sm leading-6 text-foreground",
                      toneClasses(result.tone).box,
                    )}
                  >
                    <p className="font-semibold">Jeevi's tip</p>
                    <p className="mt-1 text-muted-foreground">{t(result.tip, language)}</p>
                  </div>
                </motion.div>
              ) : null}

              {phase === "idle" ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center py-6 text-center"
                >
                  <p className="text-sm leading-6 text-muted-foreground">
                    Upload a food photo or tap a quick-scan chip to see an instant
                    suitability score, key nutrition tags, and a simple tip for your
                    child's age.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
