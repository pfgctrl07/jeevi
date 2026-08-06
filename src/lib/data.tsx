import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  BookOpenText,
  BrainCircuit,
  CalendarDays,
  ClipboardPlus,
  Cross,
  FileText,
  HeartPulse,
  Hospital,
  House,
  Languages,
  MapPinned,
  MessageCircleHeart,
  PackageOpen,
  Pill,
  ScanSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";

export type AppLanguage = "en" | "ta" | "hi";
export type AppRole = "parent" | "doctor" | "hospital";

export type SectionKey =
  | "dashboard"
  | "vaccination"
  | "records"
  | "appointments"
  | "nutrition"
  | "hospitals"
  | "emergency"
  | "learning"
  | "growth"
  | "prescriptions"
  | "telemedicine"
  | "community"
  | "marketplace"
  | "abha"
  | "doctor"
  | "hospital"
  | "settings";

export type LabelSet = {
  en: string;
  ta: string;
  hi: string;
};

export type PriorityCard = {
  id: SectionKey;
  title: LabelSet;
  description: LabelSet;
  buttonLabel: LabelSet;
  icon: LucideIcon;
  accent: string;
  status: LabelSet;
};

export type SummaryItem = {
  title: LabelSet;
  value: LabelSet;
  supporting: LabelSet;
  tone: "primary" | "success" | "warning" | "danger";
};

export type ActivityItem = {
  id: string;
  title: LabelSet;
  detail: LabelSet;
  time: LabelSet;
};

export type SidebarItem = {
  id: SectionKey;
  label: LabelSet;
  icon: LucideIcon;
  roles: AppRole[];
};

export type QuickMetric = {
  label: LabelSet;
  value: LabelSet;
  tone: "primary" | "success" | "warning";
};

export type HighlightItem = {
  title: LabelSet;
  detail: LabelSet;
  icon: LucideIcon;
};

export type ModuleSection = {
  title: LabelSet;
  description: LabelSet;
  icon: LucideIcon;
  highlights: HighlightItem[];
  emptyState?: {
    title: LabelSet;
    description: LabelSet;
  };
};

export type ModalItem = {
  label: LabelSet;
  value: LabelSet;
};

export type ModalContent = {
  title: LabelSet;
  description: LabelSet;
  tone: "default" | "primary" | "success" | "warning" | "danger";
  items?: ModalItem[];
  cards?: Array<{
    title: LabelSet;
    detail: LabelSet;
    tone: "primary" | "success" | "warning" | "danger";
  }>;
  note?: LabelSet;
};

export type LearningLesson = {
  id: string;
  title: LabelSet;
  category: LabelSet;
  duration: LabelSet;
  description: LabelSet;
  gradient: string;
};

export type LearningShelf = {
  title: LabelSet;
  lessons: LearningLesson[];
};

export const languageOptions: Array<{
  code: AppLanguage;
  label: LabelSet;
  icon: LucideIcon;
}> = [
  {
    code: "en",
    label: { en: "English", ta: "ஆங்கிலம்", hi: "अंग्रेज़ी" },
    icon: Languages,
  },
  {
    code: "ta",
    label: { en: "Tamil", ta: "தமிழ்", hi: "तमिल" },
    icon: Languages,
  },
  {
    code: "hi",
    label: { en: "Hindi", ta: "இந்தி", hi: "हिंदी" },
    icon: Languages,
  },
];

export const roleOptions: Array<{ code: AppRole; label: LabelSet }> = [
  {
    code: "parent",
    label: { en: "Parent", ta: "பெற்றோர்", hi: "माता-पिता" },
  },
  {
    code: "doctor",
    label: { en: "Doctor", ta: "மருத்துவர்", hi: "डॉक्टर" },
  },
  {
    code: "hospital",
    label: { en: "Hospital", ta: "மருத்துவமனை", hi: "अस्पताल" },
  },
];

export const priorityCards: PriorityCard[] = [
  {
    id: "emergency",
    title: {
      en: "Emergency Access",
      ta: "அவசர அணுகல்",
      hi: "आपात पहुंच",
    },
    description: {
      en: "Call ambulance, child emergency, and urgent contacts fast",
      ta: "அம்புலன்ஸ் மற்றும் அவசர எண்களை உடனே திறக்கவும்",
      hi: "एंबुलेंस और आपात संपर्क तुरंत खोलें",
    },
    buttonLabel: {
      en: "Open Help",
      ta: "உதவி திறக்க",
      hi: "मदद खोलें",
    },
    icon: Cross,
    accent: "from-red-500/20 to-rose-400/10",
    status: { en: "Always ready", ta: "எப்போதும் தயாராக", hi: "हमेशा तैयार" },
  },
  {
    id: "appointments",
    title: {
      en: "Next Appointment",
      ta: "அடுத்த நேரம்",
      hi: "अगली मुलाकात",
    },
    description: {
      en: "Dr. Raman will review growth and feeding",
      ta: "டாக்டர் ராமன் வளர்ச்சியும் உணவும் பார்க்கிறார்",
      hi: "डॉ. रमन वृद्धि और आहार की समीक्षा करेंगे",
    },
    buttonLabel: { en: "Open Visit", ta: "நேரம் திறக்க", hi: "मुलाकात खोलें" },
    icon: CalendarDays,
    accent: "from-emerald-500/20 to-teal-400/10",
    status: { en: "20 July, 10:30 AM", ta: "20 ஜூலை, 10:30", hi: "20 जुलाई, 10:30" },
  },
  {
    id: "learning",
    title: {
      en: "Health Learning",
      ta: "சுகாதார கற்றல்",
      hi: "स्वास्थ्य सीखना",
    },
    description: {
      en: "Simple weekly lessons for pregnancy, feeding, and baby care",
      ta: "கர்ப்பம், உணவு, குழந்தை பராமரிப்புக்கு எளிய பாடங்கள்",
      hi: "गर्भावस्था, आहार और बेबी केयर के आसान पाठ",
    },
    buttonLabel: { en: "Open Learning", ta: "கற்றல் திறக்க", hi: "लर्निंग खोलें" },
    icon: BookOpenText,
    accent: "from-violet-500/20 to-indigo-400/10",
    status: { en: "Prototype ready", ta: "மாதிரி தயார்", hi: "प्रोटोटाइप तैयार" },
  },
  {
    id: "hospitals",
    title: {
      en: "Doctor Information",
      ta: "மருத்துவர் தகவல்",
      hi: "डॉक्टर जानकारी",
    },
    description: {
      en: "See nearby hospitals, support type, and who to contact",
      ta: "அருகிலுள்ள மருத்துவமனை மற்றும் தொடர்பு விவரம் பார்க்கவும்",
      hi: "पास के अस्पताल और संपर्क विवरण देखें",
    },
    buttonLabel: { en: "Explore Care", ta: "சிகிச்சை பார்க்க", hi: "केयर देखें" },
    icon: MapPinned,
    accent: "from-sky-500/20 to-cyan-400/10",
    status: { en: "3 centers nearby", ta: "3 மையங்கள்", hi: "3 केंद्र पास में" },
  },
  {
    id: "records",
    title: {
      en: "Patient Services",
      ta: "நோயாளர் சேவைகள்",
      hi: "रोगी सेवाएँ",
    },
    description: {
      en: "Medical record, prescriptions, and care notes in one place",
      ta: "பதிவுகள், மருந்துகள், குறிப்புகள் ஒரே இடத்தில்",
      hi: "रिकॉर्ड, दवाइयाँ और नोट्स एक ही जगह",
    },
    buttonLabel: { en: "Open Record", ta: "பதிவு திறக்க", hi: "रिकॉर्ड खोलें" },
    icon: ClipboardPlus,
    accent: "from-blue-500/20 to-indigo-400/10",
    status: { en: "Everything together", ta: "அனைத்தும் ஒன்றாக", hi: "सब एक जगह" },
  },
];

export const summaryItems: SummaryItem[] = [
  {
    title: { en: "Next Vaccine", ta: "அடுத்த தடுப்பூசி", hi: "अगला टीका" },
    value: { en: "MMR", ta: "MMR", hi: "MMR" },
    supporting: {
      en: "15 July 2026",
      ta: "15 ஜூலை 2026",
      hi: "15 जुलाई 2026",
    },
    tone: "primary",
  },
  {
    title: { en: "Next Visit", ta: "அடுத்த சந்திப்பு", hi: "अगली मुलाकात" },
    value: { en: "Dr. Raman", ta: "டாக்டர் ராமன்", hi: "डॉ. रमन" },
    supporting: {
      en: "20 July 2026 · 10:30 AM",
      ta: "20 ஜூலை 2026 · 10:30",
      hi: "20 जुलाई 2026 · 10:30",
    },
    tone: "warning",
  },
  {
    title: { en: "Health Status", ta: "நல நிலை", hi: "स्वास्थ्य स्थिति" },
    value: { en: "Healthy", ta: "நலமாக", hi: "स्वस्थ" },
    supporting: {
      en: "Feeding and growth look steady",
      ta: "உணவும் வளர்ச்சியும் சீராக உள்ளது",
      hi: "खानपान और विकास स्थिर हैं",
    },
    tone: "success",
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "1",
    title: { en: "Vaccination Completed", ta: "தடுப்பூசி முடிந்தது", hi: "टीकाकरण पूरा हुआ" },
    detail: {
      en: "Polio booster marked complete by nurse Meena.",
      ta: "போலியோ பூஸ்டர் nurse Meena மூலம் முடிந்தது.",
      hi: "पोलियो बूस्टर नर्स मीना ने पूरा दर्ज किया।",
    },
    time: { en: "Today", ta: "இன்று", hi: "आज" },
  },
  {
    id: "2",
    title: { en: "Doctor Visit", ta: "மருத்துவர் சந்திப்பு", hi: "डॉक्टर विज़िट" },
    detail: {
      en: "Routine growth check completed with Dr. Raman.",
      ta: "டாக்டர் ராமனுடன் வளர்ச்சி பரிசோதனை முடிந்தது.",
      hi: "डॉ. रमन के साथ नियमित विकास जांच पूरी हुई।",
    },
    time: { en: "Yesterday", ta: "நேற்று", hi: "कल" },
  },
  {
    id: "3",
    title: { en: "Nutrition Report Generated", ta: "ஊட்டச்சத்து அறிக்கை", hi: "पोषण रिपोर्ट" },
    detail: {
      en: "Weekly food plan shared for mother and child.",
      ta: "அம்மாவுக்கும் குழந்தைக்கும் வார உணவுத் திட்டம் அனுப்பப்பட்டது.",
      hi: "मां और बच्चे के लिए साप्ताहिक भोजन योजना साझा की गई।",
    },
    time: { en: "2 days ago", ta: "2 நாள் முன்", hi: "2 दिन पहले" },
  },
  {
    id: "4",
    title: { en: "Prescription Downloaded", ta: "மருந்து பதிவிறக்கம்", hi: "प्रिस्क्रिप्शन डाउनलोड" },
    detail: {
      en: "Vitamin D prescription saved for offline access.",
      ta: "Vitamin D மருந்து ஆஃப்லைனுக்கு சேமிக்கப்பட்டது.",
      hi: "विटामिन D पर्ची ऑफलाइन उपयोग के लिए सहेजी गई।",
    },
    time: { en: "3 days ago", ta: "3 நாள் முன்", hi: "3 दिन पहले" },
  },
];

export const quickMetrics: QuickMetric[] = [
  {
    label: { en: "Next Vaccine", ta: "அடுத்த தடுப்பூசி", hi: "अगला टीका" },
    value: { en: "MMR · 15 July 2026", ta: "MMR · 15 ஜூலை 2026", hi: "MMR · 15 जुलाई 2026" },
    tone: "primary",
  },
  {
    label: { en: "Next Visit", ta: "அடுத்த சந்திப்பு", hi: "अगली मुलाकात" },
    value: { en: "Dr. Raman · 20 July", ta: "டாக்டர் ராமன் · 20 ஜூலை", hi: "डॉ. रमन · 20 जुलाई" },
    tone: "warning",
  },
  {
    label: { en: "Emergency", ta: "அவசரம்", hi: "आपातकाल" },
    value: { en: "108 ready", ta: "108 தயார்", hi: "108 तैयार" },
    tone: "warning",
  },
];

export const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: { en: "My Child Today", ta: "இன்று என் குழந்தை", hi: "आज मेरा बच्चा" }, icon: House, roles: ["parent"] },
  { id: "vaccination", label: { en: "Vaccination", ta: "தடுப்பூசி", hi: "टीकाकरण" }, icon: ShieldCheck, roles: ["parent", "doctor", "hospital"] },
  { id: "records", label: { en: "Medical Records", ta: "மருத்துவ பதிவுகள்", hi: "मेडिकल रिकॉर्ड" }, icon: ClipboardPlus, roles: ["parent", "doctor", "hospital"] },
  { id: "appointments", label: { en: "Appointments", ta: "நேரங்கள்", hi: "अपॉइंटमेंट" }, icon: CalendarDays, roles: ["parent", "doctor", "hospital"] },
  { id: "nutrition", label: { en: "Nutrition AI", ta: "ஊட்டச்சத்து AI", hi: "पोषण AI" }, icon: Sparkles, roles: ["parent"] },
  { id: "growth", label: { en: "Growth Tracker", ta: "வளர்ச்சி கண்காணிப்பு", hi: "ग्रोथ ट्रैकर" }, icon: Activity, roles: ["parent", "doctor"] },
  { id: "prescriptions", label: { en: "Prescriptions", ta: "மருந்துகள்", hi: "प्रिस्क्रिप्शन" }, icon: Pill, roles: ["parent", "doctor"] },
  { id: "learning", label: { en: "Learning Hub", ta: "கற்றல் மையம்", hi: "लर्निंग हब" }, icon: BookOpenText, roles: ["parent"] },
  { id: "telemedicine", label: { en: "Telemedicine", ta: "தொலை மருத்துவம்", hi: "टेलीमेडिसिन" }, icon: Video, roles: ["parent", "doctor"] },
  { id: "community", label: { en: "Community", ta: "சமூக ஆதரம்", hi: "समुदाय" }, icon: MessageCircleHeart, roles: ["parent"] },
  { id: "marketplace", label: { en: "Marketplace", ta: "சந்தை", hi: "मार्केटप्लेस" }, icon: PackageOpen, roles: ["parent"] },
  { id: "hospitals", label: { en: "Nearby Hospitals", ta: "அருகிலுள்ள மருத்துவமனைகள்", hi: "पास के अस्पताल" }, icon: MapPinned, roles: ["parent"] },
  { id: "emergency", label: { en: "Emergency", ta: "அவசரம்", hi: "आपातकाल" }, icon: Cross, roles: ["parent", "doctor", "hospital"] },
  { id: "abha", label: { en: "ABHA Ready", ta: "ABHA தயார்", hi: "ABHA तैयार" }, icon: ScanSearch, roles: ["parent"] },
  { id: "doctor", label: { en: "Doctor Portal", ta: "மருத்துவர் பகுதி", hi: "डॉक्टर पोर्टल" }, icon: Stethoscope, roles: ["doctor"] },
  { id: "hospital", label: { en: "Hospital Portal", ta: "மருத்துவமனை பகுதி", hi: "अस्पताल पोर्टल" }, icon: Hospital, roles: ["hospital"] },
  { id: "settings", label: { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" }, icon: Settings, roles: ["parent", "doctor", "hospital"] },
];

export const learningShelves: LearningShelf[] = [
  {
    title: {
      en: "Continue Watching",
      ta: "தொடர்ந்து பார்ப்பது",
      hi: "देखना जारी रखें",
    },
    lessons: [
      {
        id: "pregnancy-12",
        title: { en: "Week 12 Pregnancy Care", ta: "12வது வார கர்ப்ப பராமரிப்பு", hi: "सप्ताह 12 गर्भ देखभाल" },
        category: { en: "Pregnancy Learning", ta: "கர்ப்ப கற்றல்", hi: "गर्भावस्था सीखना" },
        duration: { en: "8 min", ta: "8 நிமி", hi: "8 मिनट" },
        description: { en: "A calm prototype lesson about rest, food, and simple warning signs during week 12.", ta: "12வது வார ஓய்வு, உணவு, எளிய அறிகுறிகள் பற்றிய மாதிரி பாடம்.", hi: "सप्ताह 12 में आराम, भोजन और सरल संकेतों पर एक प्रोटोटाइप पाठ।" },
        gradient: "from-fuchsia-200 via-rose-100 to-white",
      },
      {
        id: "feeding-starters",
        title: { en: "First Feeding Basics", ta: "முதல் உணவு அடிப்படை", hi: "पहली फीडिंग की मूल बातें" },
        category: { en: "Baby Feeding Guidance", ta: "குழந்தை உணவு வழிகாட்டி", hi: "बेबी फीडिंग गाइडेंस" },
        duration: { en: "6 min", ta: "6 நிமி", hi: "6 मिनट" },
        description: { en: "Prototype guidance on introducing first foods in a simple and parent-friendly flow.", ta: "முதல் உணவை எளிதாக அறிமுகப்படுத்தும் மாதிரி வழிகாட்டல்.", hi: "पहले भोजन की शुरुआत पर सरल प्रोटोटाइप मार्गदर्शन।" },
        gradient: "from-sky-200 via-cyan-100 to-white",
      },
    ],
  },
  {
    title: {
      en: "Recommended For You",
      ta: "உங்களுக்கு பரிந்துரை",
      hi: "आपके लिए सुझाव",
    },
    lessons: [
      {
        id: "weekly-doubts",
        title: { en: "Weekly Pregnancy Doubts", ta: "வாராந்திர கர்ப்ப சந்தேகங்கள்", hi: "साप्ताहिक गर्भावस्था सवाल" },
        category: { en: "Pregnancy Learning", ta: "கர்ப்ப கற்றல்", hi: "गर्भावस्था सीखना" },
        duration: { en: "7 min", ta: "7 நிமி", hi: "7 मिनट" },
        description: { en: "A presentation-style lesson for common weekly pregnancy questions and calm next steps.", ta: "வாராந்திர கர்ப்ப கேள்விகளுக்கான மாதிரி விளக்கம்.", hi: "सामान्य साप्ताहिक गर्भावस्था सवालों के लिए प्रोटोटाइप पाठ।" },
        gradient: "from-amber-200 via-orange-100 to-white",
      },
      {
        id: "mother-wellness",
        title: { en: "Mother Wellness Reset", ta: "தாய் நல ஒழுங்கு", hi: "मदर वेलनेस रीसेट" },
        category: { en: "Mother Wellness", ta: "தாய் நலம்", hi: "मां का स्वास्थ्य" },
        duration: { en: "5 min", ta: "5 நிமி", hi: "5 मिनट" },
        description: { en: "Dummy learning content focused on rest, hydration, and simple emotional care.", ta: "ஓய்வு, தண்ணீர், மனநலம் பற்றிய மாதிரி உள்ளடக்கம்.", hi: "आराम, पानी और भावनात्मक देखभाल पर डमी कंटेंट।" },
        gradient: "from-emerald-200 via-lime-100 to-white",
      },
    ],
  },
  {
    title: {
      en: "Weekly Learning",
      ta: "வார கற்றல்",
      hi: "साप्ताहिक लर्निंग",
    },
    lessons: [
      {
        id: "vaccine-awareness",
        title: { en: "Why Vaccines Matter", ta: "தடுப்பூசி ஏன் முக்கியம்", hi: "टीके क्यों ज़रूरी हैं" },
        category: { en: "Vaccination Awareness", ta: "தடுப்பூசி விழிப்புணர்வு", hi: "टीकाकरण जागरूकता" },
        duration: { en: "9 min", ta: "9 நிமி", hi: "9 मिनट" },
        description: { en: "A premium prototype lesson explaining vaccines using simple visuals and words.", ta: "எளிய விளக்கத்துடன் தடுப்பூசி பற்றி மாதிரி பாடம்.", hi: "सरल शब्दों में टीकाकरण समझाने वाला प्रोटोटाइप पाठ।" },
        gradient: "from-blue-200 via-indigo-100 to-white",
      },
      {
        id: "growth-milestones",
        title: { en: "Milestones at 1 Year", ta: "1 வயது வளர்ச்சி", hi: "1 वर्ष के माइलस्टोन" },
        category: { en: "Child Care Learning", ta: "குழந்தை பராமரிப்பு", hi: "चाइल्ड केयर लर्निंग" },
        duration: { en: "10 min", ta: "10 நிமி", hi: "10 मिनट" },
        description: { en: "Dummy content for walking, speech, sleep, and healthy activity at one year.", ta: "நடப்பு, பேச்சு, தூக்கம் பற்றிய மாதிரி உள்ளடக்கம்.", hi: "चलना, बोलना, नींद और गतिविधि पर डमी कंटेंट।" },
        gradient: "from-violet-200 via-purple-100 to-white",
      },
    ],
  },
  {
    title: {
      en: "Baby Care Learning",
      ta: "குழந்தை பராமரிப்பு கற்றல்",
      hi: "बेबी केयर लर्निंग",
    },
    lessons: [
      {
        id: "bath-safety",
        title: { en: "Bath Time Safety", ta: "குளியல் பாதுகாப்பு", hi: "नहलाने की सुरक्षा" },
        category: { en: "Child Care Learning", ta: "குழந்தை பராமரிப்பு", hi: "चाइल्ड केयर लर्निंग" },
        duration: { en: "4 min", ta: "4 நிமி", hi: "4 मिनट" },
        description: { en: "Prototype guidance for baby bath setup, water safety, and after-care.", ta: "குழந்தை குளியல் பாதுகாப்புக்கான மாதிரி வழிகாட்டி.", hi: "बेबी बाथ सुरक्षा पर प्रोटोटाइप गाइड।" },
        gradient: "from-teal-200 via-cyan-100 to-white",
      },
      {
        id: "sleep-routine",
        title: { en: "Gentle Sleep Routine", ta: "மென்மையான தூக்க ஒழுங்கு", hi: "सॉफ्ट स्लीप रूटीन" },
        category: { en: "Baby Feeding Guidance", ta: "குழந்தை உணவு வழிகாட்டி", hi: "बेबी फीडिंग गाइडेंस" },
        duration: { en: "5 min", ta: "5 நிமி", hi: "5 मिनट" },
        description: { en: "A realistic prototype lesson about sleep rhythm, feeding gaps, and soothing habits.", ta: "தூக்க ஒழுங்கு மற்றும் சமாதான பழக்கங்கள் பற்றிய மாதிரி பாடம்.", hi: "नींद की लय और शांत करने की आदतों पर प्रोटोटाइप पाठ।" },
        gradient: "from-slate-200 via-blue-50 to-white",
      },
    ],
  },
];

export const moduleSections: Record<SectionKey, ModuleSection> = {
  dashboard: {
    title: { en: "My Child Today", ta: "இன்று என் குழந்தை", hi: "आज मेरा बच्चा" },
    description: {
      en: "The most important health actions are shown first.",
      ta: "முக்கியமான நல நடவடிக்கைகள் முதலில் காட்டப்படுகின்றன.",
      hi: "सबसे ज़रूरी स्वास्थ्य काम पहले दिखाए जाते हैं।",
    },
    icon: HeartPulse,
    highlights: [],
  },
  vaccination: {
    title: { en: "Vaccination Timeline", ta: "தடுப்பூசி காலவரிசை", hi: "टीका टाइमलाइन" },
    description: {
      en: "Use timelines and progress instead of hard-to-read tables.",
      ta: "அட்டவணை இல்லாமல் காலவரிசையால் எளிதாக பார்க்கவும்.",
      hi: "टेबल के बजाय टाइमलाइन और प्रगति से जल्दी समझें।",
    },
    icon: ShieldCheck,
    highlights: [
      { title: { en: "Progress ring", ta: "முன்னேற்ற வளையம்", hi: "प्रगति रिंग" }, detail: { en: "82% immunization complete", ta: "82% முடிந்தது", hi: "82% पूरा" }, icon: Activity },
      { title: { en: "Missed alert", ta: "தவறிய எச்சரிக்கை", hi: "छूटा अलर्ट" }, detail: { en: "No missed vaccines this month", ta: "இந்த மாதம் தவறவில்லை", hi: "इस महीने कुछ नहीं छूटा" }, icon: BellRing },
      { title: { en: "Calendar", ta: "காலண்டர்", hi: "कैलेंडर" }, detail: { en: "MMR marked for 15 July 2026", ta: "15 ஜூலை 2026", hi: "15 जुलाई 2026" }, icon: CalendarDays },
    ],
  },
  records: {
    title: { en: "Child Medical Record", ta: "குழந்தை மருத்துவ பதிவு", hi: "बच्चे का रिकॉर्ड" },
    description: {
      en: "Child profile, allergies, conditions, reports, and notes in clear cards.",
      ta: "குழந்தை விவரம், அலர்ஜி, நிலைகள், அறிக்கைகள், குறிப்புகள் அனைத்தும் எளிய அட்டைகளில்.",
      hi: "प्रोफाइल, एलर्जी, रिपोर्ट और नोट्स साफ़ कार्ड में।",
    },
    icon: ClipboardPlus,
    highlights: [
      { title: { en: "Blood group", ta: "இரத்த வகை", hi: "ब्लड ग्रुप" }, detail: { en: "B+ verified", ta: "B+ உறுதி", hi: "B+ सत्यापित" }, icon: HeartPulse },
      { title: { en: "Allergies", ta: "அலர்ஜி", hi: "एलर्जी" }, detail: { en: "No known allergies", ta: "அலர்ஜி இல்லை", hi: "कोई ज्ञात एलर्जी नहीं" }, icon: FileText },
      { title: { en: "Doctor notes", ta: "மருத்துவர் குறிப்புகள்", hi: "डॉक्टर नोट्स" }, detail: { en: "Feeding and sleep are improving", ta: "உணவும் தூக்கமும் மேம்படுகிறது", hi: "खानपान और नींद बेहतर हैं" }, icon: Stethoscope },
    ],
  },
  appointments: {
    title: { en: "Appointment Journey", ta: "சந்திப்பு பயணம்", hi: "अपॉइंटमेंट यात्रा" },
    description: {
      en: "Upcoming and previous visits with doctor and hospital information.",
      ta: "அடுத்ததும் முந்தையதும், மருத்துவர் மற்றும் மருத்துவமனை தகவலுடன்.",
      hi: "आने वाली और पिछली मुलाकातें, डॉक्टर और अस्पताल जानकारी सहित।",
    },
    icon: CalendarDays,
    highlights: [
      { title: { en: "Upcoming", ta: "வரவுள்ளது", hi: "आने वाला" }, detail: { en: "20 July · Dr. Raman", ta: "20 ஜூலை · டாக்டர் ராமன்", hi: "20 जुलाई · डॉ. रमन" }, icon: CalendarDays },
      { title: { en: "Status", ta: "நிலை", hi: "स्थिति" }, detail: { en: "Confirmed", ta: "உறுதி", hi: "पुष्ट" }, icon: Activity },
      { title: { en: "Hospital", ta: "மருத்துவமனை", hi: "अस्पताल" }, detail: { en: "Jeevitham Care Center", ta: "Jeevitham Care Center", hi: "जीविथम केयर सेंटर" }, icon: Hospital },
    ],
  },
  nutrition: {
    title: { en: "AI Nutrition Center", ta: "AI ஊட்டச்சத்து மையம்", hi: "AI पोषण केंद्र" },
    description: {
      en: "Daily food advice, child suitability score, and food scanner placeholder.",
      ta: "தினசரி உணவு ஆலோசனை, பொருத்தம் மதிப்பெண், food scanner இடம்.",
      hi: "रोज़ का भोजन सुझाव, उपयुक्तता स्कोर और फूड स्कैनर।",
    },
    icon: Sparkles,
    highlights: [
      { title: { en: "Food scanner", ta: "உணவு ஸ்கேனர்", hi: "फूड स्कैनर" }, detail: { en: "Upload food image or open camera placeholder", ta: "படம் ஏற்றவும் அல்லது கேமரா திறக்கவும்", hi: "फोटो अपलोड करें या कैमरा खोलें" }, icon: ScanSearch },
      { title: { en: "Suitability score", ta: "பொருத்தம் மதிப்பெண்", hi: "उपयुक्तता स्कोर" }, detail: { en: "Chocolate biscuit: avoid daily use", ta: "Chocolate biscuit: தினமும் வேண்டாம்", hi: "चॉकलेट बिस्किट: रोज़ न दें" }, icon: Activity },
      { title: { en: "AI recommendation", ta: "AI பரிந்துரை", hi: "AI सुझाव" }, detail: { en: "Add fruit and boiled egg for better protein", ta: "பழமும் முட்டையும் சேர்க்கவும்", hi: "फल और उबला अंडा जोड़ें" }, icon: Sparkles },
    ],
  },
  hospitals: {
    title: { en: "Nearby Care Options", ta: "அருகிலுள்ள சிகிச்சை இடங்கள்", hi: "पास के देखभाल केंद्र" },
    description: {
      en: "Find hospitals with distance, support type, and quick actions.",
      ta: "தூரம், சேவை, உடனடி செயல்களுடன் மருத்துவமனைகள்.",
      hi: "दूरी, सेवा और त्वरित क्रिया वाले अस्पताल।",
    },
    icon: MapPinned,
    highlights: [
      { title: { en: "Closest center", ta: "அருகில்", hi: "सबसे पास" }, detail: { en: "Primary Health Centre · 1.8 km", ta: "1.8 கிமீ", hi: "1.8 किमी" }, icon: MapPinned },
      { title: { en: "Emergency ready", ta: "அவசர தயாராக", hi: "आपात तैयार" }, detail: { en: "24/7 emergency desk available", ta: "24/7 மேசை திறந்துள்ளது", hi: "24/7 उपलब्ध" }, icon: Cross },
      { title: { en: "Specialization", ta: "சிறப்பு", hi: "विशेषज्ञता" }, detail: { en: "Mother and child care", ta: "அம்மா மற்றும் குழந்தை", hi: "मां और बच्चा देखभाल" }, icon: Hospital },
    ],
  },
  emergency: {
    title: { en: "One-Tap Emergency", ta: "ஒரு தொடுதல் அவசரம்", hi: "एक टैप आपातकाल" },
    description: {
      en: "Large emergency options for ambulance, child emergency, and helplines.",
      ta: "அம்புலன்ஸ், குழந்தை அவசரம், உதவி எண்களுக்கு பெரிய விருப்பங்கள்.",
      hi: "एंबुलेंस, बाल आपातकाल और हेल्पलाइन के लिए बड़े विकल्प।",
    },
    icon: Cross,
    highlights: [
      { title: { en: "Ambulance", ta: "அம்புலன்ஸ்", hi: "एंबुलेंस" }, detail: { en: "108", ta: "108", hi: "108" }, icon: Cross },
      { title: { en: "Women helpline", ta: "பெண்கள் உதவி", hi: "महिला हेल्पलाइन" }, detail: { en: "181", ta: "181", hi: "181" }, icon: BellRing },
      { title: { en: "Hospital hotline", ta: "மருத்துவமனை ஹாட்லைன்", hi: "अस्पताल हेल्पलाइन" }, detail: { en: "1800-21-JEEVI", ta: "1800-21-JEEVI", hi: "1800-21-JEEVI" }, icon: Hospital },
    ],
  },
  learning: {
    title: { en: "Learning Hub", ta: "கற்றல் மையம்", hi: "लर्निंग हब" },
    description: {
      en: "Nutrition, mother wellness, vaccination, and child growth learning by age group.",
      ta: "வயது படி ஊட்டச்சத்து, தாய் நலம், தடுப்பூசி, வளர்ச்சி கற்றல்.",
      hi: "उम्र के अनुसार पोषण, मां का स्वास्थ्य, टीकाकरण और विकास सीखें।",
    },
    icon: BookOpenText,
    highlights: [
      { title: { en: "0–6 months", ta: "0–6 மாதம்", hi: "0–6 माह" }, detail: { en: "Feeding and sleep basics", ta: "உணவு மற்றும் தூக்கம்", hi: "खानपान और नींद" }, icon: BookOpenText },
      { title: { en: "1–3 years", ta: "1–3 வயது", hi: "1–3 वर्ष" }, detail: { en: "Speech and activity milestones", ta: "பேச்சு மற்றும் செயல் திறன்", hi: "बोलना और गतिविधि" }, icon: BrainCircuit },
      { title: { en: "Progress", ta: "முன்னேற்றம்", hi: "प्रगति" }, detail: { en: "3 lessons completed this week", ta: "இந்த வாரம் 3 பாடங்கள்", hi: "इस सप्ताह 3 पाठ" }, icon: Activity },
    ],
  },
  growth: {
    title: { en: "Growth Tracker", ta: "வளர்ச்சி கண்காணிப்பு", hi: "ग्रोथ ट्रैकर" },
    description: {
      en: "Height, weight, milestones, nutrition score, and vaccine completion in visual charts.",
      ta: "உயரம், எடை, திறன்கள், ஊட்டச்சத்து, தடுப்பூசி அனைத்தும் பார்வை வடிவில்.",
      hi: "लंबाई, वज़न, माइलस्टोन, पोषण और टीकाकरण चार्ट में।",
    },
    icon: Activity,
    highlights: [
      { title: { en: "Weight", ta: "எடை", hi: "वज़न" }, detail: { en: "8.4 kg", ta: "8.4 கிலோ", hi: "8.4 किग्रा" }, icon: Activity },
      { title: { en: "Height", ta: "உயரம்", hi: "लंबाई" }, detail: { en: "72 cm", ta: "72 செ.மீ", hi: "72 सेमी" }, icon: Activity },
      { title: { en: "Milestones", ta: "திறன்கள்", hi: "माइलस्टोन" }, detail: { en: "On track for age", ta: "வயதுக்கு சரியாக", hi: "उम्र के अनुसार सही" }, icon: BrainCircuit },
    ],
  },
  prescriptions: {
    title: { en: "Digital Prescriptions", ta: "மின்னணு மருந்துகள்", hi: "डिजिटल प्रिस्क्रिप्शन" },
    description: {
      en: "Active and previous prescriptions with notes, timeline, and download actions.",
      ta: "செயலில் மற்றும் முந்தைய மருந்துகள், குறிப்புகள், காலவரிசை, பதிவிறக்கம்.",
      hi: "सक्रिय और पुरानी पर्चियाँ, नोट्स, टाइमलाइन और डाउनलोड।",
    },
    icon: Pill,
    highlights: [
      { title: { en: "Active medicine", ta: "செயலில் மருந்து", hi: "सक्रिय दवा" }, detail: { en: "Vitamin D drops", ta: "Vitamin D drops", hi: "विटामिन D ड्रॉप्स" }, icon: Pill },
      { title: { en: "Doctor notes", ta: "மருத்துவர் குறிப்பு", hi: "डॉक्टर नोट्स" }, detail: { en: "Continue after breakfast", ta: "காலை உணவுக்கு பின்", hi: "नाश्ते के बाद जारी रखें" }, icon: FileText },
      { title: { en: "Download PDF", ta: "PDF பதிவிறக்கம்", hi: "PDF डाउनलोड" }, detail: { en: "Prescription ready to save", ta: "சேமிக்க தயார்", hi: "सहेजने के लिए तैयार" }, icon: FileText },
    ],
  },
  telemedicine: {
    title: { en: "Telemedicine", ta: "தொலை மருத்துவம்", hi: "टेलीमेडिसिन" },
    description: {
      en: "Upcoming consultation, join call, doctor details, and summary.",
      ta: "அடுத்த ஆலோசனை, அழைப்பு இணை, மருத்துவர் விவரம், சுருக்கம்.",
      hi: "आने वाली सलाह, कॉल जॉइन, डॉक्टर जानकारी और सारांश।",
    },
    icon: Video,
    highlights: [
      { title: { en: "Upcoming call", ta: "அடுத்த அழைப்பு", hi: "आगामी कॉल" }, detail: { en: "25 July · 6:00 PM", ta: "25 ஜூலை · 6:00", hi: "25 जुलाई · 6:00" }, icon: Video },
      { title: { en: "Doctor", ta: "மருத்துவர்", hi: "डॉक्टर" }, detail: { en: "Dr. Priya Menon", ta: "டாக்டர் பிரியா மேனன்", hi: "डॉ. प्रिया मेनन" }, icon: Stethoscope },
      { title: { en: "Summary", ta: "சுருக்கம்", hi: "सारांश" }, detail: { en: "Feeding follow-up and fever check", ta: "உணவு மற்றும் காய்ச்சல் பார்வை", hi: "खानपान और बुखार फॉलो-अप" }, icon: FileText },
    ],
  },
  community: {
    title: { en: "Community Support", ta: "சமூக ஆதரவு", hi: "समुदाय सहायता" },
    description: {
      en: "Ask questions, read parenting tips, and join safe support circles.",
      ta: "கேள்வி கேள், பெற்றோர் குறிப்புகள் படி, பாதுகாப்பான வட்டங்களில் சேர.",
      hi: "सवाल पूछें, पेरेंटिंग टिप्स पढ़ें और सुरक्षित समूहों से जुड़ें।",
    },
    icon: MessageCircleHeart,
    highlights: [
      { title: { en: "Ask a question", ta: "கேள்வி கேள்", hi: "सवाल पूछें" }, detail: { en: "Get friendly answers from experts", ta: "நிபுணர் பதில்கள்", hi: "विशेषज्ञ जवाब" }, icon: MessageCircleHeart },
      { title: { en: "Mother support", ta: "அம்மா ஆதரம்", hi: "मां सहायता" }, detail: { en: "Simple support circles by stage", ta: "படிநிலை ஆதரவு வட்டங்கள்", hi: "हर चरण के लिए समूह" }, icon: HeartPulse },
      { title: { en: "Expert talks", ta: "நிபுணர் உரை", hi: "विशेषज्ञ चर्चा" }, detail: { en: "Weekly child care sessions", ta: "வாராந்திர அமர்வுகள்", hi: "साप्ताहिक सत्र" }, icon: Sparkles },
    ],
  },
  marketplace: {
    title: { en: "Trusted Marketplace", ta: "நம்பகமான சந்தை", hi: "विश्वसनीय बाज़ार" },
    description: {
      en: "Baby care, nutrition, toys, and mother wellness products with safety cues.",
      ta: "குழந்தை பராமரிப்பு, ஊட்டச்சத்து, விளையாட்டு, தாய் நல பொருட்கள்.",
      hi: "बेबी केयर, पोषण, खिलौने और मां के स्वास्थ्य उत्पाद।",
    },
    icon: PackageOpen,
    highlights: [
      { title: { en: "Safety rating", ta: "பாதுகாப்பு மதிப்பீடு", hi: "सुरक्षा रेटिंग" }, detail: { en: "Only trusted picks shown first", ta: "நம்பகமானவை முதலில்", hi: "विश्वसनीय विकल्प पहले" }, icon: ShieldCheck },
      { title: { en: "Age suitability", ta: "வயது பொருத்தம்", hi: "उम्र उपयुक्तता" }, detail: { en: "0–6 months and 6–12 months filters", ta: "0–6 மற்றும் 6–12 மாத வடிகட்டி", hi: "0–6 और 6–12 माह फ़िल्टर" }, icon: Activity },
      { title: { en: "Recommendations", ta: "பரிந்துரை", hi: "सिफारिश" }, detail: { en: "Doctor and Jeevi AI guided", ta: "மருத்துவர் மற்றும் Jeevi AI", hi: "डॉक्टर और Jeevi AI मार्गदर्शित" }, icon: Sparkles },
    ],
  },
  abha: {
    title: { en: "ABHA Ready", ta: "ABHA தயார்", hi: "ABHA तैयार" },
    description: {
      en: "A frontend-ready placeholder for future health record sync.",
      ta: "எதிர்கால சுகாதார பதிவு ஒத்திசைவு UI இடமமைப்பு.",
      hi: "भविष्य में रिकॉर्ड सिंक के लिए फ्रंटएंड तैयार स्थान।",
    },
    icon: ScanSearch,
    highlights: [
      { title: { en: "Status", ta: "நிலை", hi: "स्थिति" }, detail: { en: "Not connected yet", ta: "இன்னும் இணைக்கவில்லை", hi: "अभी कनेक्ट नहीं" }, icon: ScanSearch },
      { title: { en: "Connect ABHA", ta: "ABHA இணை", hi: "ABHA जोड़ें" }, detail: { en: "UI ready for future integration", ta: "இணைப்புக்கு தயார்", hi: "भविष्य इंटीग्रेशन के लिए तैयार" }, icon: ShieldCheck },
      { title: { en: "Record sync", ta: "பதிவு ஒத்திசைவு", hi: "रिकॉर्ड सिंक" }, detail: { en: "Vaccines and reports will sync later", ta: "பின்னர் ஒத்திசையும்", hi: "बाद में सिंक होगा" }, icon: FileText },
    ],
  },
  doctor: {
    title: { en: "Doctor Portal", ta: "மருத்துவர் பகுதி", hi: "डॉक्टर पोर्टल" },
    description: {
      en: "Patients, prescriptions, vaccination notes, and visit workflow.",
      ta: "நோயாளிகள், மருந்துகள், தடுப்பூசி குறிப்புகள், சந்திப்பு ஓட்டம்.",
      hi: "मरीज़, प्रिस्क्रिप्शन, टीका नोट्स और विज़िट वर्कफ़्लो।",
    },
    icon: Stethoscope,
    highlights: [
      { title: { en: "Patients", ta: "நோயாளிகள்", hi: "मरीज़" }, detail: { en: "18 children under active follow-up", ta: "18 குழந்தைகள்", hi: "18 बच्चे" }, icon: Stethoscope },
      { title: { en: "Vaccination notes", ta: "தடுப்பூசி குறிப்பு", hi: "टीका नोट्स" }, detail: { en: "Add post-visit notes simply", ta: "சந்திப்பு பின் குறிப்பு", hi: "विज़िट के बाद नोट जोड़ें" }, icon: ShieldCheck },
      { title: { en: "Appointments", ta: "நேரங்கள்", hi: "अपॉइंटमेंट" }, detail: { en: "Today’s queue shown in card form", ta: "இன்றைய வரிசை", hi: "आज की सूची" }, icon: CalendarDays },
    ],
  },
  hospital: {
    title: { en: "Hospital Portal", ta: "மருத்துவமனை பகுதி", hi: "अस्पताल पोर्टल" },
    description: {
      en: "Patient management, doctor management, reports, and vaccine campaigns.",
      ta: "நோயாளி மேலாண்மை, மருத்துவர் மேலாண்மை, அறிக்கைகள், தடுப்பூசி முகாம்கள்.",
      hi: "मरीज़ प्रबंधन, डॉक्टर प्रबंधन, रिपोर्ट और टीका अभियान।",
    },
    icon: Hospital,
    highlights: [
      { title: { en: "Campaigns", ta: "முகாம்கள்", hi: "अभियान" }, detail: { en: "Vaccination camp starts next week", ta: "அடுத்த வாரம் தொடங்கும்", hi: "अगले सप्ताह शुरू" }, icon: ShieldCheck },
      { title: { en: "Doctors", ta: "மருத்துவர்", hi: "डॉक्टर" }, detail: { en: "12 doctors active today", ta: "இன்று 12 செயலில்", hi: "आज 12 सक्रिय" }, icon: Stethoscope },
      { title: { en: "Reports", ta: "அறிக்கைகள்", hi: "रिपोर्ट" }, detail: { en: "OP and vaccine summaries ready", ta: "OP மற்றும் vaccine சுருக்கம்", hi: "OP और टीका सारांश तैयार" }, icon: FileText },
    ],
  },
  settings: {
    title: { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" },
    description: {
      en: "Language, notifications, caregiver access, and accessibility preferences.",
      ta: "மொழி, அறிவிப்புகள், பராமரிப்பாளர் அணுகல், அணுகல் விருப்பங்கள்.",
      hi: "भाषा, सूचना, देखभालकर्ता एक्सेस और एक्सेसिबिलिटी विकल्प।",
    },
    icon: Settings,
    highlights: [
      { title: { en: "Language", ta: "மொழி", hi: "भाषा" }, detail: { en: "English, Tamil, and Hindi ready", ta: "ஆங்கிலம், தமிழ், இந்தி", hi: "अंग्रेज़ी, तमिल, हिंदी" }, icon: Languages },
      { title: { en: "Accessibility", ta: "அணுகல்", hi: "सुगम्यता" }, detail: { en: "Large text and high-contrast friendly", ta: "பெரிய எழுத்து மற்றும் contrast", hi: "बड़ा टेक्स्ट और हाई कॉन्ट्रास्ट" }, icon: Settings },
    ],
    emptyState: {
      title: {
        en: "No pending settings updates.",
        ta: "புதிய அமைப்புகள் இல்லை.",
        hi: "कोई लंबित सेटिंग नहीं।",
      },
      description: {
        en: "Your current preferences already support a simple family care experience.",
        ta: "உங்கள் தற்போதைய விருப்பங்கள் குடும்ப பராமரிப்புக்கு தயாராக உள்ளன.",
        hi: "आपकी मौजूदा प्राथमिकताएं सरल परिवार देखभाल के लिए तैयार हैं।",
      },
    },
  },
};

export const modalContentMap: Record<Exclude<SectionKey, "dashboard">, ModalContent> = {
  vaccination: {
    title: { en: "Vaccination Timeline", ta: "தடுப்பூசி காலவரிசை", hi: "टीका टाइमलाइन" },
    description: { en: "Visual view of upcoming, completed, and missed doses.", ta: "வரவிருக்கும், முடிந்த, தவறிய டோஸ்கள்.", hi: "आने वाले, पूरे और छूटे डोज़।" },
    tone: "default",
    items: [
      { label: { en: "MMR", ta: "MMR", hi: "MMR" }, value: { en: "15 July 2026", ta: "15 ஜூலை 2026", hi: "15 जुलाई 2026" } },
      { label: { en: "DPT booster", ta: "DPT booster", hi: "DPT बूस्टर" }, value: { en: "Completed", ta: "முடிந்தது", hi: "पूरा" } },
      { label: { en: "Immunization score", ta: "தடுப்பூசி மதிப்பெண்", hi: "टीकाकरण स्कोर" }, value: { en: "82%", ta: "82%", hi: "82%" } },
    ],
  },
  records: {
    title: { en: "Child Health Record", ta: "குழந்தை நல பதிவு", hi: "बच्चे का रिकॉर्ड" },
    description: { en: "Profile, allergies, growth, and doctor notes together.", ta: "விவரம், அலர்ஜி, வளர்ச்சி, மருத்துவர் குறிப்பு.", hi: "प्रोफाइल, एलर्जी, विकास और डॉक्टर नोट्स।" },
    tone: "default",
    items: [
      { label: { en: "Child name", ta: "குழந்தை பெயர்", hi: "बच्चे का नाम" }, value: { en: "Anika Priya", ta: "அனிகா பிரியா", hi: "अनिका प्रिया" } },
      { label: { en: "Blood group", ta: "இரத்த வகை", hi: "ब्लड ग्रुप" }, value: { en: "B+", ta: "B+", hi: "B+" } },
      { label: { en: "Allergies", ta: "அலர்ஜி", hi: "एलर्जी" }, value: { en: "No known allergies", ta: "அலர்ஜி இல்லை", hi: "कोई ज्ञात एलर्जी नहीं" } },
    ],
  },
  appointments: {
    title: { en: "Appointments", ta: "நேரங்கள்", hi: "अपॉइंटमेंट" },
    description: { en: "Simple list of next and previous visits.", ta: "அடுத்ததும் முந்தையதும் எளிய பட்டியல்.", hi: "आने वाली और पिछली मुलाकातों की सूची।" },
    tone: "warning",
    items: [
      { label: { en: "Dr. Raman", ta: "டாக்டர் ராமன்", hi: "डॉ. रमन" }, value: { en: "20 July · 10:30 AM", ta: "20 ஜூலை · 10:30", hi: "20 जुलाई · 10:30" } },
      { label: { en: "Teleconsultation", ta: "தொலை ஆலோசனை", hi: "टेलीकंसल्टेशन" }, value: { en: "25 July · 6:00 PM", ta: "25 ஜூலை · 6:00", hi: "25 जुलाई · 6:00" } },
    ],
    note: { en: "Booking remains frontend-only in this prototype.", ta: "இந்த முன்னோட்டத்தில் முன்பதிவு frontend-only.", hi: "इस प्रोटोटाइप में बुकिंग केवल फ्रंटएंड है।" },
  },
  nutrition: {
    title: { en: "Nutrition AI Center", ta: "ஊட்டச்சத்து AI மையம்", hi: "पोषण AI केंद्र" },
    description: { en: "Food scanner placeholder and child suitability advice.", ta: "food scanner மற்றும் குழந்தை பொருத்த ஆலோசனை.", hi: "फूड स्कैनर और उपयुक्तता सलाह।" },
    tone: "success",
    cards: [
      { title: { en: "Food scanner", ta: "உணவு ஸ்கேனர்", hi: "फूड स्कैनर" }, detail: { en: "Upload image or open camera placeholder", ta: "படம் ஏற்று அல்லது கேமரா திற", hi: "फोटो अपलोड करें या कैमरा खोलें" }, tone: "primary" },
      { title: { en: "Chocolate biscuit", ta: "Chocolate biscuit", hi: "चॉकलेट बिस्किट" }, detail: { en: "High sugar, low protein, avoid daily use", ta: "சர்க்கரை அதிகம், தினமும் வேண்டாம்", hi: "शुगर ज़्यादा, रोज़ न दें" }, tone: "warning" },
      { title: { en: "Today’s tip", ta: "இன்றைய குறிப்பு", hi: "आज की सलाह" }, detail: { en: "Add dal, greens, and boiled egg", ta: "பருப்பு, கீரை, முட்டை சேர்க்கவும்", hi: "दाल, साग और अंडा जोड़ें" }, tone: "success" },
    ],
  },
  hospitals: {
    title: { en: "Nearby Hospitals", ta: "அருகிலுள்ள மருத்துவமனைகள்", hi: "पास के अस्पताल" },
    description: { en: "Distance, specialization, call, and direction ready.", ta: "தூரம், சிறப்பு, அழைப்பு, வழி.", hi: "दूरी, विशेषज्ञता, कॉल और दिशा।" },
    tone: "default",
    cards: [
      { title: { en: "Primary Health Centre", ta: "Primary Health Centre", hi: "प्राथमिक स्वास्थ्य केंद्र" }, detail: { en: "1.8 km · Mother and child care", ta: "1.8 கிமீ · அம்மா மற்றும் குழந்தை", hi: "1.8 किमी · मां और बच्चा देखभाल" }, tone: "primary" },
      { title: { en: "Jeevitham Mother & Child Clinic", ta: "Jeevitham Mother & Child Clinic", hi: "जीविथम मदर एंड चाइल्ड क्लिनिक" }, detail: { en: "3.2 km · Open today", ta: "3.2 கிமீ · இன்று திறந்துள்ளது", hi: "3.2 किमी · आज खुला" }, tone: "success" },
    ],
  },
  emergency: {
    title: { en: "Emergency Help", ta: "அவசர உதவி", hi: "आपात मदद" },
    description: { en: "Large and simple support actions.", ta: "பெரியதும் எளியதும் உதவி விருப்பங்கள்.", hi: "बड़े और सरल सहायता विकल्प।" },
    tone: "danger",
    cards: [
      { title: { en: "Ambulance", ta: "அம்புலன்ஸ்", hi: "एंबुलेंस" }, detail: { en: "Call 108", ta: "108 அழை", hi: "108 कॉल" }, tone: "danger" },
      { title: { en: "Women helpline", ta: "பெண்கள் உதவி", hi: "महिला हेल्पलाइन" }, detail: { en: "Call 181", ta: "181 அழை", hi: "181 कॉल" }, tone: "warning" },
      { title: { en: "Child emergency", ta: "குழந்தை அவசரம்", hi: "बाल आपातकाल" }, detail: { en: "Nearest child care hospital", ta: "அருகிலுள்ள குழந்தை மருத்துவமனை", hi: "नज़दीकी बाल अस्पताल" }, tone: "primary" },
    ],
  },
  learning: {
    title: { en: "Learning Hub", ta: "கற்றல் மையம்", hi: "लर्निंग हब" },
    description: { en: "Videos, tutorials, and guided lessons.", ta: "வீடியோ, பயிற்சி, வழிகாட்டும் பாடங்கள்.", hi: "वीडियो, ट्यूटोरियल और गाइडेड पाठ।" },
    tone: "default",
    cards: [
      { title: { en: "0–6 months", ta: "0–6 மாதம்", hi: "0–6 माह" }, detail: { en: "Feeding basics and mother recovery", ta: "உணவு மற்றும் தாய் மீட்பு", hi: "खानपान और मां की रिकवरी" }, tone: "primary" },
      { title: { en: "1–3 years", ta: "1–3 வயது", hi: "1–3 वर्ष" }, detail: { en: "Play, speech, and habit building", ta: "விளையாட்டு, பேச்சு, பழக்கம்", hi: "खेल, बोलना और आदतें" }, tone: "success" },
    ],
  },
  growth: {
    title: { en: "Growth Tracker", ta: "வளர்ச்சி கண்காணிப்பு", hi: "ग्रोथ ट्रैकर" },
    description: { en: "Visual tracking for growth and milestones.", ta: "வளர்ச்சியும் திறன்களும் பார்வை வடிவில்.", hi: "विकास और माइलस्टोन को दृश्य रूप में देखें।" },
    tone: "success",
    items: [
      { label: { en: "Weight", ta: "எடை", hi: "वज़न" }, value: { en: "8.4 kg", ta: "8.4 கிலோ", hi: "8.4 किग्रा" } },
      { label: { en: "Height", ta: "உயரம்", hi: "लंबाई" }, value: { en: "72 cm", ta: "72 செ.மீ", hi: "72 सेमी" } },
      { label: { en: "Milestones", ta: "திறன்கள்", hi: "माइलस्टोन" }, value: { en: "On track", ta: "சரியாக", hi: "सही" } },
    ],
  },
  prescriptions: {
    title: { en: "Digital Prescriptions", ta: "மின்னணு மருந்துகள்", hi: "डिजिटल प्रिस्क्रिप्शन" },
    description: { en: "Active medicines and download-ready notes.", ta: "செயலில் மருந்துகள் மற்றும் சேமிக்கக்கூடிய குறிப்புகள்.", hi: "सक्रिय दवाएं और डाउनलोड योग्य नोट्स।" },
    tone: "warning",
    items: [
      { label: { en: "Active", ta: "செயலில்", hi: "सक्रिय" }, value: { en: "Vitamin D drops", ta: "Vitamin D drops", hi: "विटामिन D ड्रॉप्स" } },
      { label: { en: "Doctor note", ta: "மருத்துவர் குறிப்பு", hi: "डॉक्टर नोट" }, value: { en: "Continue after breakfast", ta: "காலை உணவுக்குப் பின்", hi: "नाश्ते के बाद जारी रखें" } },
    ],
  },
  telemedicine: {
    title: { en: "Telemedicine", ta: "தொலை மருத்துவம்", hi: "टेलीमेडिसिन" },
    description: { en: "Upcoming consultation and join-ready details.", ta: "அடுத்த ஆலோசனை மற்றும் இணை விவரங்கள்.", hi: "आगामी परामर्श और जॉइन विवरण।" },
    tone: "primary",
    cards: [
      { title: { en: "Upcoming consultation", ta: "அடுத்த ஆலோசனை", hi: "आगामी सलाह" }, detail: { en: "25 July · 6:00 PM", ta: "25 ஜூலை · 6:00", hi: "25 जुलाई · 6:00" }, tone: "primary" },
      { title: { en: "Consultation summary", ta: "ஆலோசனை சுருக்கம்", hi: "परामर्श सारांश" }, detail: { en: "Feeding and fever follow-up", ta: "உணவு மற்றும் காய்ச்சல் பின்பார்வை", hi: "खानपान और बुखार फॉलो-अप" }, tone: "success" },
    ],
  },
  community: {
    title: { en: "Community Support", ta: "சமூக ஆதரவு", hi: "समुदाय सहायता" },
    description: { en: "Safe spaces for questions and mother support.", ta: "கேள்வி மற்றும் அம்மா ஆதரத்திற்கு பாதுகாப்பான இடம்.", hi: "सवाल और मां सहायता के लिए सुरक्षित स्थान।" },
    tone: "default",
    cards: [
      { title: { en: "Ask questions", ta: "கேள்வி கேள்", hi: "सवाल पूछें" }, detail: { en: "Parenting and health doubts", ta: "பெற்றோர் மற்றும் நல சந்தேகங்கள்", hi: "पेरेंटिंग और स्वास्थ्य सवाल" }, tone: "primary" },
      { title: { en: "Expert discussions", ta: "நிபுணர் உரை", hi: "विशेषज्ञ चर्चा" }, detail: { en: "Simple weekly guidance", ta: "வாராந்திர எளிய வழிகாட்டல்", hi: "साप्ताहिक सरल मार्गदर्शन" }, tone: "success" },
    ],
  },
  marketplace: {
    title: { en: "Trusted Marketplace", ta: "நம்பகமான சந்தை", hi: "विश्वसनीय बाज़ार" },
    description: { en: "Healthcare-friendly product cards with safety cues.", ta: "பாதுகாப்பு குறியீட்டுடன் சுகாதார பொருட்கள்.", hi: "सुरक्षा संकेतों वाले हेल्थ उत्पाद कार्ड।" },
    tone: "default",
    cards: [
      { title: { en: "Baby care", ta: "குழந்தை பராமரிப்பு", hi: "बेबी केयर" }, detail: { en: "Safety rated and age tagged", ta: "பாதுகாப்பு மதிப்பீடு", hi: "सुरक्षा रेटेड" }, tone: "primary" },
      { title: { en: "Mother wellness", ta: "அம்மா நலம்", hi: "मां स्वास्थ्य" }, detail: { en: "Recommended by care team", ta: "பராமரிப்பு குழு பரிந்துரை", hi: "देखभाल टीम की सिफारिश" }, tone: "success" },
    ],
  },
  abha: {
    title: { en: "ABHA Ready", ta: "ABHA தயார்", hi: "ABHA तैयार" },
    description: { en: "Frontend placeholder for future ABHA connection.", ta: "எதிர்கால ABHA இணைப்புக்கு UI.", hi: "भविष्य ABHA कनेक्शन के लिए UI।" },
    tone: "default",
    items: [
      { label: { en: "Status", ta: "நிலை", hi: "स्थिति" }, value: { en: "Pending", ta: "நிலுவை", hi: "लंबित" } },
      { label: { en: "Sync", ta: "ஒத்திசைவு", hi: "सिंक" }, value: { en: "Health record sync later", ta: "பின்னர் இணையும்", hi: "बाद में सिंक होगा" } },
    ],
  },
  doctor: {
    title: { en: "Doctor Portal", ta: "மருத்துவர் பகுதி", hi: "डॉक्टर पोर्टल" },
    description: { en: "Patient workflow, prescriptions, and vaccine follow-up.", ta: "நோயாளி ஓட்டம், மருந்துகள், தடுப்பூசி பின்பார்வை.", hi: "मरीज़ वर्कफ़्लो, दवाएं और टीका फॉलो-अप।" },
    tone: "default",
    cards: [
      { title: { en: "Patients", ta: "நோயாளிகள்", hi: "मरीज़" }, detail: { en: "18 active follow-ups", ta: "18 செயலில்", hi: "18 सक्रिय" }, tone: "primary" },
      { title: { en: "Notes", ta: "குறிப்புகள்", hi: "नोट्स" }, detail: { en: "Write simple post-visit notes", ta: "சந்திப்பு பின் குறிப்புகள்", hi: "विज़िट के बाद नोट्स" }, tone: "success" },
    ],
  },
  hospital: {
    title: { en: "Hospital Portal", ta: "மருத்துவமனை பகுதி", hi: "अस्पताल पोर्टल" },
    description: { en: "Manage campaigns, doctors, and care summaries.", ta: "முகாம்கள், மருத்துவர்கள், சுருக்கங்கள்.", hi: "अभियान, डॉक्टर और सारांश प्रबंधन।" },
    tone: "default",
    cards: [
      { title: { en: "Vaccination campaign", ta: "தடுப்பூசி முகாம்", hi: "टीकाकरण अभियान" }, detail: { en: "Starts next week", ta: "அடுத்த வாரம்", hi: "अगले सप्ताह" }, tone: "warning" },
      { title: { en: "Care summary", ta: "சிகிச்சை சுருக்கம்", hi: "देखभाल सारांश" }, detail: { en: "OP and vaccine reports ready", ta: "OP மற்றும் vaccine அறிக்கை", hi: "OP और टीका रिपोर्ट तैयार" }, tone: "primary" },
    ],
  },
  settings: {
    title: { en: "Settings", ta: "அமைப்புகள்", hi: "सेटिंग्स" },
    description: { en: "Language, notifications, and accessibility preferences.", ta: "மொழி, அறிவிப்பு, அணுகல் விருப்பங்கள்.", hi: "भाषा, सूचना और एक्सेसिबिलिटी विकल्प।" },
    tone: "default",
    items: [
      { label: { en: "Language", ta: "மொழி", hi: "भाषा" }, value: { en: "English / Tamil / Hindi", ta: "ஆங்கிலம் / தமிழ் / இந்தி", hi: "अंग्रेज़ी / तमिल / हिंदी" } },
      { label: { en: "Accessibility", ta: "அணுகல்", hi: "सुगम्यता" }, value: { en: "Large touch targets enabled", ta: "பெரிய தொடுதல் இடங்கள்", hi: "बड़े टच टार्गेट" } },
    ],
  },
};

export function t(label: LabelSet, language: AppLanguage) {
  return label[language];
}
