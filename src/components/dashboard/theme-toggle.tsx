import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useAppState } from "@/contexts/app-state-context";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useAppState();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-12 w-[110px] items-center rounded-full border border-border/70 bg-background/80 p-1 shadow-soft transition-colors duration-300"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className={cn(
          "absolute top-1 h-10 w-[50px] rounded-full shadow-panel",
          isDark
            ? "left-[55px] bg-slate-900"
            : "left-1 bg-white",
        )}
      />
      <span className="relative z-10 flex flex-1 items-center justify-center">
        <Sun className={cn("h-4 w-4 transition-colors", isDark ? "text-muted-foreground" : "text-amber-500")} />
      </span>
      <span className="relative z-10 flex flex-1 items-center justify-center">
        <Moon className={cn("h-4 w-4 transition-colors", isDark ? "text-sky-300" : "text-muted-foreground")} />
      </span>
    </button>
  );
}
