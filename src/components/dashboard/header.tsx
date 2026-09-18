import { Bell, ChevronDown, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/contexts/app-state-context";
import { languageOptions, roleOptions, t, tx } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
 const {
 selectedLanguage,
 setSelectedLanguage,
 selectedRole,
 setSelectedRole,
 } = useAppState();
 const { logout } = useAuth();

 return (
 <header className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
 <div className="min-w-0">
 <p className="text-sm font-medium text-primary">
 {tx(selectedRole === "parent" ? "My Child Today" : selectedRole === "doctor" ? "Doctor Care Workspace" : "Hospital Care Workspace", selectedLanguage)}
 </p>
 <h1 className="mt-1 truncate text-2xl font-semibold text-foreground">
 {tx("Welcome back, Priya 👋", selectedLanguage)}
 </h1>
 <p className="mt-1 text-sm text-muted-foreground">
 {tx(selectedRole === "parent" ? "See the next vaccine, next appointment, health status, and urgent care in one view." : selectedRole === "doctor" ? "Follow vaccinations, appointments, and prescriptions without admin-style clutter." : "Manage campaigns, care teams, and summaries with simple healthcare-first screens.", selectedLanguage)}
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-3">
 <ThemeToggle />

 <Button
 variant="outline"
 size="icon"
 aria-label="Notifications"
 className="border-border/70 bg-background text-foreground hover:bg-muted"
 >
 <Bell className="h-5 w-5" />
 </Button>

 <div className="relative">
 <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <select
 value={selectedLanguage}
 onChange={(event) =>
 setSelectedLanguage(event.target.value as typeof selectedLanguage)
 }
 className="min-h-11 rounded-xl border border-border/70 bg-background py-2 pl-9 pr-9 text-sm font-medium text-foreground outline-none transition focus:border-primary"
 aria-label="Language switcher"
 >
 {languageOptions.map((language) => (
 <option key={language.code} value={language.code}>
 {language.nativeLabel}
 </option>
 ))}
 </select>
 </div>

 <div className="relative">
 <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <select
 value={selectedRole}
 onChange={(event) =>
 setSelectedRole(event.target.value as typeof selectedRole)
 }
 className="min-h-11 rounded-xl border border-border/70 bg-background px-4 pr-9 text-sm font-medium text-foreground outline-none transition focus:border-primary"
 aria-label="Role switcher"
 >
 {roleOptions.map((role) => (
 <option key={role.code} value={role.code}>
 {t(role.label, selectedLanguage)}
 </option>
 ))}
 </select>
 </div>

 <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-3 py-2">
 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
 P
 </div>
 <div className="hidden sm:block">
 <p className="text-sm font-semibold text-foreground">Priya</p>
 <p className="text-xs text-muted-foreground">
 {tx(selectedRole === "parent" ? "Family Admin" : selectedRole === "doctor" ? "Care Doctor" : "Hospital Desk", selectedLanguage)}
 </p>
 </div>
 </div>

 <Button
 variant="ghost"
 size="icon"
 onClick={logout}
 aria-label="Log out"
 className="text-muted-foreground hover:bg-muted hover:text-foreground"
 >
 <LogOut className="h-5 w-5" />
 </Button>
 </div>
 </header>
 );
}
