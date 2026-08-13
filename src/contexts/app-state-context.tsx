import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  sidebarItems,
  type AppLanguage,
  type AppRole,
  type SectionKey,
} from "@/lib/data";
import { getStoredValue, setStoredValue } from "@/lib/storage";

type AppStateContextValue = {
  activeSection: SectionKey;
  setActiveSection: (section: SectionKey) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedLanguage: AppLanguage;
  setSelectedLanguage: (language: AppLanguage) => void;
  selectedRole: AppRole;
  setSelectedRole: (role: AppRole) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "jeevitham-theme";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = getStoredValue(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<AppLanguage>("en");
  const [selectedRole, setSelectedRole] = useState<AppRole>("parent");
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setStoredValue(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const canAccessSection = sidebarItems.some(
      (item) => item.id === activeSection && item.roles.includes(selectedRole),
    );

    if (!canAccessSection) {
      setActiveSection("dashboard");
    }
  }, [activeSection, selectedRole]);

  const value = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      isSidebarOpen,
      setSidebarOpen,
      selectedLanguage,
      setSelectedLanguage,
      selectedRole,
      setSelectedRole,
      theme,
      setTheme,
      isAssistantOpen,
      setAssistantOpen,
    }),
    [activeSection, isAssistantOpen, isSidebarOpen, selectedLanguage, selectedRole, theme],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}
