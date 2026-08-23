import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Bath,
  Droplets,
  Minus,
  Moon,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Stethoscope,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { t, type AppLanguage, type LabelSet } from "@/lib/data";

type Category = "feeding" | "sleep" | "bath" | "diapering" | "health";
type AgeBand = "0-6" | "6-12" | "1-3";
type Badge = "lab-tested" | "doctor-approved" | "safety-certified" | "dermatologist-tested";

type Product = {
  id: string;
  name: LabelSet;
  category: Category;
  ageBand: AgeBand;
  price: number;
  badges: Badge[];
  description: LabelSet;
  safetyNote: LabelSet;
  icon: LucideIcon;
  gradient: string;
};

const categoryMeta: Record<Category, { label: LabelSet; icon: LucideIcon }> = {
  feeding: { label: { en: "Feeding", ta: "உணவு", hi: "आहार" }, icon: Utensils },
  sleep: { label: { en: "Sleep", ta: "தூக்கம்", hi: "नींद" }, icon: Moon },
  bath: { label: { en: "Bath", ta: "குளியல்", hi: "स्नान" }, icon: Bath },
  diapering: { label: { en: "Diapering", ta: "டயப்பர்", hi: "डायपरिंग" }, icon: Droplets },
  health: { label: { en: "Health", ta: "நலம்", hi: "स्वास्थ्य" }, icon: Stethoscope },
};

const ageBandMeta: Record<AgeBand, LabelSet> = {
  "0-6": { en: "0–6 months", ta: "0–6 மாதம்", hi: "0–6 माह" },
  "6-12": { en: "6–12 months", ta: "6–12 மாதம்", hi: "6–12 माह" },
  "1-3": { en: "1–3 years", ta: "1–3 வயது", hi: "1–3 वर्ष" },
};

const badgeMeta: Record<Badge, LabelSet> = {
  "lab-tested": { en: "Lab Tested", ta: "ஆய்வக சோதனை", hi: "लैब टेस्टेड" },
  "doctor-approved": { en: "Doctor Approved", ta: "மருத்துவர் ஒப்புதல்", hi: "डॉक्टर अनुमोदित" },
  "safety-certified": { en: "Safety Certified", ta: "பாதுகாப்பு சான்று", hi: "सुरक्षा प्रमाणित" },
  "dermatologist-tested": { en: "Dermatologist Tested", ta: "தோல் மருத்துவர் சோதனை", hi: "डर्मेटोलॉजिस्ट टेस्टेड" },
};

const products: Product[] = [
  {
    id: "anti-colic-bottle",
    name: { en: "Anti-Colic Feeding Bottle", ta: "Anti-Colic பாட்டில்", hi: "एंटी-कोलिक बॉटल" },
    category: "feeding",
    ageBand: "0-6",
    price: 499,
    badges: ["lab-tested", "safety-certified"],
    description: {
      en: "Reduces air intake during feeding to ease colic and gas discomfort.",
      ta: "உணவு நேரத்தில் காற்று உட்கொள்ளலை குறைத்து வாயு அசௌகரியத்தை தவிர்க்கிறது.",
      hi: "फीडिंग के दौरान हवा कम करता है, कोलिक और गैस से राहत देता है।",
    },
    safetyNote: {
      en: "BPA-free, tested for leak resistance and safe material grade.",
      ta: "BPA இல்லாதது, கசிவு எதிர்ப்பு மற்றும் பாதுகாப்பான பொருள் தரம் சோதிக்கப்பட்டது.",
      hi: "BPA-मुक्त, लीक-प्रतिरोध और सुरक्षित सामग्री के लिए परीक्षित।",
    },
    icon: Utensils,
    gradient: "from-rose-500 to-orange-400",
  },
  {
    id: "swaddle-wrap",
    name: { en: "Organic Cotton Swaddle Wrap", ta: "Organic Cotton சுற்று துணி", hi: "ऑर्गेनिक कॉटन स्वैडल" },
    category: "sleep",
    ageBand: "0-6",
    price: 799,
    badges: ["doctor-approved", "lab-tested"],
    description: {
      en: "Breathable organic cotton wrap that supports safer, calmer sleep.",
      ta: "சுவாசிக்கக்கூடிய organic cotton, பாதுகாப்பான அமைதியான தூக்கத்திற்கு உதவும்.",
      hi: "सांस लेने योग्य ऑर्गेनिक कॉटन, सुरक्षित और शांत नींद में मदद करता है।",
    },
    safetyNote: {
      en: "GOTS-style organic certification, no harsh dyes or chemicals.",
      ta: "GOTS தர organic சான்று, கடுமையான வண்ணங்கள் இல்லை.",
      hi: "GOTS-श्रेणी ऑर्गेनिक प्रमाणन, कोई कठोर रंग या रसायन नहीं।",
    },
    icon: Moon,
    gradient: "from-indigo-500 to-violet-400",
  },
  {
    id: "baby-shampoo",
    name: { en: "Hypoallergenic Baby Shampoo", ta: "Hypoallergenic குழந்தை shampoo", hi: "हाइपोएलर्जेनिक बेबी शैंपू" },
    category: "bath",
    ageBand: "1-3",
    price: 349,
    badges: ["dermatologist-tested", "lab-tested"],
    description: {
      en: "Tear-free, gentle formula suitable for sensitive baby skin and scalp.",
      ta: "கண்ணீர் இல்லாத, மென்மையான சூத்திரம், உணர்திறன் தோலுக்கு ஏற்றது.",
      hi: "आंसू-रहित, कोमल फॉर्मूला, संवेदनशील त्वचा के लिए उपयुक्त।",
    },
    safetyNote: {
      en: "Dermatologist tested, free from sulfates and parabens.",
      ta: "தோல் மருத்துவர் சோதனை, sulfate மற்றும் paraben இல்லை.",
      hi: "डर्मेटोलॉजिस्ट टेस्टेड, सल्फेट और पैराबेन मुक्त।",
    },
    icon: Bath,
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    id: "soft-diapers",
    name: { en: "Ultra-Soft Diapers (Pack of 30)", ta: "மென்மையான டயப்பர் (30)", hi: "अल्ट्रा-सॉफ्ट डायपर (30)" },
    category: "diapering",
    ageBand: "0-6",
    price: 599,
    badges: ["lab-tested", "safety-certified"],
    description: {
      en: "High-absorbency diapers with a soft, rash-resistant inner layer.",
      ta: "அதிக உறிஞ்சும் திறன், மென்மையான அரிப்பு எதிர்ப்பு உள் அடுக்கு.",
      hi: "उच्च अवशोषण, मुलायम रैश-रोधी भीतरी परत।",
    },
    safetyNote: {
      en: "Certified skin-safe materials, breathable outer layer.",
      ta: "தோலுக்கு பாதுகாப்பான பொருட்கள் சான்றளிக்கப்பட்டவை.",
      hi: "प्रमाणित त्वचा-सुरक्षित सामग्री, सांस लेने योग्य बाहरी परत।",
    },
    icon: Droplets,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "silicone-teether",
    name: { en: "Silicone Teether Set", ta: "Silicone பல் தொங்கல் தொகுப்பு", hi: "सिलिकॉन टीदर सेट" },
    category: "health",
    ageBand: "6-12",
    price: 299,
    badges: ["lab-tested", "safety-certified"],
    description: {
      en: "Food-grade silicone teethers to soothe gums during teething.",
      ta: "பல் முளைக்கும் போது ஈறுகளை தணிக்க food-grade silicone.",
      hi: "दांत निकलने के दौरान मसूड़ों को राहत देने वाला फूड-ग्रेड सिलिकॉन।",
    },
    safetyNote: {
      en: "BPA-free, phthalate-free, dishwasher safe.",
      ta: "BPA மற்றும் phthalate இல்லை, dishwasher பாதுகாப்பானது.",
      hi: "BPA और फैथलेट-मुक्त, डिशवॉशर सुरक्षित।",
    },
    icon: Baby,
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    id: "digital-thermometer",
    name: { en: "Digital Baby Thermometer", ta: "Digital வெப்பமானி", hi: "डिजिटल बेबी थर्मामीटर" },
    category: "health",
    ageBand: "1-3",
    price: 899,
    badges: ["doctor-approved", "safety-certified"],
    description: {
      en: "Fast, accurate readings with a gentle no-contact forehead scan mode.",
      ta: "வேகமான, துல்லியமான அளவீடு — தொடு தேவையில்லாத நெற்றி பரிசோதனை.",
      hi: "तेज़, सटीक रीडिंग — बिना छुए माथे से जांचने की सुविधा।",
    },
    safetyNote: {
      en: "Clinically validated accuracy range, doctor-recommended for home use.",
      ta: "மருத்துவ ரீதியாக சரிபார்க்கப்பட்ட துல்லியம், வீட்டு பயன்பாட்டிற்கு பரிந்துரை.",
      hi: "चिकित्सकीय रूप से सत्यापित सटीकता, घर पर उपयोग के लिए अनुशंसित।",
    },
    icon: Stethoscope,
    gradient: "from-blue-500 to-indigo-400",
  },
  {
    id: "baby-bathtub",
    name: { en: "Baby Bathtub with Support", ta: "Support உடன் குளியல் தொட்டி", hi: "सपोर्ट वाला बेबी बाथटब" },
    category: "bath",
    ageBand: "0-6",
    price: 1299,
    badges: ["safety-certified", "lab-tested"],
    description: {
      en: "Anti-slip base and ergonomic support for safer bath time.",
      ta: "வழுக்காத அடிப்பகுதி, பாதுகாப்பான குளியலுக்கு ஆதரவு வடிவமைப்பு.",
      hi: "फिसलन-रोधी आधार, सुरक्षित नहाने के लिए एर्गोनॉमिक सपोर्ट।",
    },
    safetyNote: {
      en: "Load-tested base, rounded edges, certified non-toxic material.",
      ta: "சுமை சோதிக்கப்பட்ட அடிப்பகுதி, சுற்று விளிம்புகள், நச்சு இல்லாத பொருள்.",
      hi: "लोड-टेस्टेड बेस, गोल किनारे, प्रमाणित नॉन-टॉक्सिक सामग्री।",
    },
    icon: Bath,
    gradient: "from-cyan-500 to-sky-400",
  },
  {
    id: "sleep-sack",
    name: { en: "Weighted Sleep Sack", ta: "எடையுள்ள தூக்க பை", hi: "वेटेड स्लीप सैक" },
    category: "sleep",
    ageBand: "6-12",
    price: 999,
    badges: ["doctor-approved"],
    description: {
      en: "Gently weighted design that supports longer, calmer sleep stretches.",
      ta: "மென்மையான எடை வடிவமைப்பு, நீண்ட அமைதியான தூக்கத்திற்கு உதவும்.",
      hi: "हल्का वज़नी डिज़ाइन, लंबी और शांत नींद में मदद करता है।",
    },
    safetyNote: {
      en: "Weight ratio doctor-reviewed for safe overnight use.",
      ta: "இரவு பாதுகாப்பான பயன்பாட்டிற்கு எடை விகிதம் மருத்துவர் மதிப்பாய்வு.",
      hi: "रात भर सुरक्षित उपयोग के लिए वज़न अनुपात डॉक्टर-समीक्षित।",
    },
    icon: Moon,
    gradient: "from-violet-500 to-purple-400",
  },
  {
    id: "steel-spoon-set",
    name: { en: "Stainless Steel Feeding Spoon Set", ta: "Steel உணவு கரண்டி தொகுப்பு", hi: "स्टील फीडिंग स्पून सेट" },
    category: "feeding",
    ageBand: "6-12",
    price: 249,
    badges: ["lab-tested", "safety-certified"],
    description: {
      en: "Soft-tip, rust-resistant spoons sized for a baby's first solids.",
      ta: "மென்மையான நுனி, துரு எதிர்ப்பு, முதல் திட உணவுக்கு ஏற்ற அளவு.",
      hi: "सॉफ्ट-टिप, जंग-रोधी, पहले ठोस आहार के लिए सही आकार।",
    },
    safetyNote: {
      en: "Food-grade stainless steel, tested for safe first-use.",
      ta: "Food-grade steel, முதல் பயன்பாட்டிற்கு பாதுகாப்பாக சோதிக்கப்பட்டது.",
      hi: "फूड-ग्रेड स्टील, पहले उपयोग के लिए सुरक्षित परीक्षित।",
    },
    icon: Utensils,
    gradient: "from-slate-500 to-zinc-400",
  },
  {
    id: "rash-cream",
    name: { en: "Diaper Rash Cream", ta: "Diaper Rash கிரீம்", hi: "डायपर रैश क्रीम" },
    category: "diapering",
    ageBand: "1-3",
    price: 199,
    badges: ["dermatologist-tested", "doctor-approved"],
    description: {
      en: "Zinc-oxide barrier cream that soothes and protects sensitive skin.",
      ta: "Zinc-oxide அடிப்படை கிரீம், உணர்திறன் தோலை பாதுகாக்கிறது.",
      hi: "जिंक-ऑक्साइड बैरियर क्रीम, संवेदनशील त्वचा को आराम व सुरक्षा देती है।",
    },
    safetyNote: {
      en: "Fragrance-free, dermatologist tested for daily use.",
      ta: "வாசனை இல்லாதது, தினசரி பயன்பாட்டிற்கு தோல் மருத்துவர் சோதனை.",
      hi: "सुगंध-मुक्त, दैनिक उपयोग के लिए डर्मेटोलॉजिस्ट टेस्टेड।",
    },
    icon: Droplets,
    gradient: "from-teal-500 to-emerald-400",
  },
];

type CartLine = { productId: string; qty: number };

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TrustedMarketplace({ language }: { language: AppLanguage }) {
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [ageFilter, setAgeFilter] = useState<AgeBand | "all">("all");
  const [badgeFilter, setBadgeFilter] = useState<Badge | "all">("all");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter) return false;
      if (ageFilter !== "all" && product.ageBand !== ageFilter) return false;
      if (badgeFilter !== "all" && !product.badges.includes(badgeFilter)) return false;
      return true;
    });
  }, [categoryFilter, ageFilter, badgeFilter]);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...prev, { productId: product.id, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  };

  const openCart = () => {
    setDetailProduct(null);
    setOrderPlaced(false);
    setCartOpen(true);
  };

  const openDetail = (product: Product) => {
    setCartOpen(false);
    setDetailProduct(product);
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
  };

  const filterChip = (
    active: boolean,
    label: string,
    onClick: () => void,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary/50 bg-primary text-primary-foreground"
          : "border-border/70 bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  return (
    <Card className="overflow-hidden border-border/70 bg-card/88">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-panel">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Trusted Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Only lab-tested and doctor-approved baby products
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={openCart} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {filterChip(categoryFilter === "all", "All categories", () => setCategoryFilter("all"), "cat-all")}
            {(Object.keys(categoryMeta) as Category[]).map((category) =>
              filterChip(
                categoryFilter === category,
                t(categoryMeta[category].label, language),
                () => setCategoryFilter(category),
                `cat-${category}`,
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filterChip(ageFilter === "all", "All ages", () => setAgeFilter("all"), "age-all")}
            {(Object.keys(ageBandMeta) as AgeBand[]).map((age) =>
              filterChip(
                ageFilter === age,
                t(ageBandMeta[age], language),
                () => setAgeFilter(age),
                `age-${age}`,
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filterChip(badgeFilter === "all", "All trust badges", () => setBadgeFilter("all"), "badge-all")}
            {(Object.keys(badgeMeta) as Badge[]).map((badge) =>
              filterChip(
                badgeFilter === badge,
                t(badgeMeta[badge], language),
                () => setBadgeFilter(badge),
                `badge-${badge}`,
              ),
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <motion.button
              key={product.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => openDetail(product)}
              className="flex h-full flex-col rounded-2xl border border-border/70 bg-background/72 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              <div
                className={cn(
                  "mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                  product.gradient,
                )}
              >
                <product.icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-foreground">{t(product.name, language)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(ageBandMeta[product.ageBand], language)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-500"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {t(badgeMeta[badge], language)}
                  </span>
                ))}
              </div>
              <p className="mt-auto pt-3 text-lg font-semibold text-foreground">
                {formatInr(product.price)}
              </p>
            </motion.button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="rounded-2xl border border-border/70 bg-background/72 p-6 text-center text-sm text-muted-foreground">
            No products match these filters yet.
          </p>
        ) : null}
      </CardContent>

      <Modal
        open={Boolean(detailProduct)}
        onOpenChange={(open) => {
          if (!open) setDetailProduct(null);
        }}
        title={detailProduct ? t(detailProduct.name, language) : ""}
        description={detailProduct ? formatInr(detailProduct.price) : ""}
      >
        {detailProduct ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {detailProduct.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t(badgeMeta[badge], language)}
                </span>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {t(detailProduct.description, language)}
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4 text-sm leading-6 text-foreground">
              <p className="font-semibold">Safety note</p>
              <p className="mt-1 text-muted-foreground">{t(detailProduct.safetyNote, language)}</p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                addToCart(detailProduct);
                setDetailProduct(null);
              }}
            >
              Add to Cart · {formatInr(detailProduct.price)}
            </Button>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={isCartOpen}
        onOpenChange={setCartOpen}
        title="Your Cart"
        description="Checkout is frontend-only in this prototype."
      >
        {orderPlaced ? (
          <div className="space-y-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-center">
            <p className="font-semibold text-foreground">Order placed (prototype)</p>
            <p className="text-sm text-muted-foreground">
              This checkout is frontend-only — no real payment or delivery occurs.
            </p>
            <Button variant="outline" onClick={() => setCartOpen(false)}>
              Close
            </Button>
          </div>
        ) : cart.length === 0 ? (
          <p className="rounded-2xl border border-border/70 bg-background/72 p-6 text-center text-sm text-muted-foreground">
            Your cart is empty. Add a trusted product to get started.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.map((line) => {
                const product = products.find((item) => item.id === line.productId);
                if (!product) return null;
                return (
                  <div
                    key={line.productId}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(product.name, language)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatInr(product.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty(line.productId, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold text-foreground">
                        {line.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQty(line.productId, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/72 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Total</p>
              <p className="text-lg font-semibold text-foreground">{formatInr(cartTotal)}</p>
            </div>
            <Button className="w-full" onClick={placeOrder}>
              Place Order
            </Button>
          </div>
        )}
      </Modal>
    </Card>
  );
}
