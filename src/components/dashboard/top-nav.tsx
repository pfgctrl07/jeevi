import { useState } from "react";
import { Bell, ChevronDown, LogOut, MoreHorizontal } from "lucide-react";
import { sidebarItems, t, tx, languageOptions, roleOptions, type SectionKey } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAppState } from "@/contexts/app-state-context";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

const ESSENTIAL_SECTION_IDS: SectionKey[] = [
  "dashboard",
  "vaccination",
  "appointments",
  "nutrition",
  "learning",
  "emergency",
  "doctor",
  "hospital",
];

export function TopNav() {
  const {
    activeSection,
    setActiveSection,
    selectedLanguage,
    setSelectedLanguage,
    selectedRole,
    setSelectedRole,
  } = useAppState();
  const { logout } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const visibleItems = sidebarItems.filter((item) => item.roles.includes(selectedRole));
  const essentialItems = visibleItems.filter(
    (item) => ESSENTIAL_SECTION_IDS.includes(item.id) && item.id !== "settings",
  );
  const moreItems = visibleItems.filter(
    (item) => !ESSENTIAL_SECTION_IDS.includes(item.id) && item.id !== "settings",
  );
  const settingsItem = visibleItems.find((item) => item.id === "settings");

  function select(id: SectionKey) {
    setActiveSection(id);
    setShowMore(false);
  }

  return (
    <header className="border-b border-border/70 bg-card">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo compact />

        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </button>

          <select
            value={selectedLanguage}
            onChange={(event) => setSelectedLanguage(event.target.value as typeof selectedLanguage)}
            className="h-9 rounded-md border border-border/70 bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
            aria-label="Language switcher"
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>
                {language.nativeLabel}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value as typeof selectedRole)}
            className="h-9 rounded-md border border-border/70 bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
            aria-label="Role switcher"
          >
            {roleOptions.map((role) => (
              <option key={role.code} value={role.code}>
                {t(role.label, selectedLanguage)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 border-t border-border/70 px-4 py-1.5 sm:px-6">
        {essentialItems.map((item) => {
          const isActive = item.id === activeSection;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t(item.label, selectedLanguage)}
            </button>
          );
        })}

        {moreItems.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition",
                moreItems.some((i) => i.id === activeSection)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
              {tx("More", selectedLanguage)}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showMore ? (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setShowMore(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-md border border-border/70 bg-card py-1 shadow-soft">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item.id)}
                    className={cn(
                      "block w-full px-3 py-2 text-left text-sm",
                      item.id === activeSection
                        ? "text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {t(item.label, selectedLanguage)}
                  </button>
                ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {settingsItem ? (
          <button
            type="button"
            onClick={() => select(settingsItem.id)}
            className={cn(
              "ml-auto rounded-md px-3 py-1.5 text-sm font-medium transition",
              settingsItem.id === activeSection
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(settingsItem.label, selectedLanguage)}
          </button>
        ) : null}
      </nav>
    </header>
  );
}
