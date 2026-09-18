import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sidebarItems, t, tx, type SectionKey } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAppState } from "@/contexts/app-state-context";
import { Logo } from "./logo";

// Kept small and always visible — the handful of things a caregiver reaches
// for daily. Everything else lives behind "More" so the list never
// overwhelms on first glance.
const ESSENTIAL_SECTION_IDS: SectionKey[] = [
 "dashboard",
 "vaccination",
 "appointments",
 "emergency",
 "nutrition",
 "learning",
 "doctor",
 "hospital",
];

function NavList({
 items,
 activeSection,
 selectedLanguage,
 onSelect,
}: {
 items: typeof sidebarItems;
 activeSection: SectionKey;
 selectedLanguage: Parameters<typeof t>[1];
 onSelect: (id: SectionKey) => void;
}) {
 return (
 <>
 {items.map((item) => {
 const Icon = item.icon;
 const isActive = item.id === activeSection;

 return (
 <button
 key={item.id}
 type="button"
 onClick={() => onSelect(item.id)}
 className={cn(
 "flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-medium transition",
 isActive
 ? "bg-primary text-white shadow-panel"
 : "text-muted-foreground hover:bg-muted hover:text-foreground",
 )}
 >
 <Icon className="h-5 w-5" />
 <span>{t(item.label, selectedLanguage)}</span>
 </button>
 );
 })}
 </>
 );
}

export function Sidebar() {
 const {
 activeSection,
 setActiveSection,
 isSidebarOpen,
 setSidebarOpen,
 selectedLanguage,
 selectedRole,
 } = useAppState();
 const [showMore, setShowMore] = useState(false);

 const visibleItems = sidebarItems.filter((item) =>
 item.roles.includes(selectedRole),
 );
 const essentialItems = visibleItems.filter(
 (item) => ESSENTIAL_SECTION_IDS.includes(item.id) && item.id !== "settings",
 );
 const moreItems = visibleItems.filter(
 (item) => !ESSENTIAL_SECTION_IDS.includes(item.id) && item.id !== "settings",
 );
 const settingsItem = visibleItems.find((item) => item.id === "settings");

 // If the currently open section is tucked away under "More", expand it
 // automatically so the highlighted nav item is never hidden.
 const moreContainsActive = moreItems.some((item) => item.id === activeSection);
 const isMoreExpanded = showMore || moreContainsActive;

 function selectAndMaybeClose(id: SectionKey, closeDrawer: boolean) {
 setActiveSection(id);
 if (closeDrawer) setSidebarOpen(false);
 }

 return (
 <>
 <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-4 shadow-soft lg:hidden">
 <Logo compact language={selectedLanguage} />
 <Button
 variant="outline"
 size="icon"
 className="border-border/70 bg-background text-foreground hover:bg-muted"
 onClick={() => setSidebarOpen(true)}
 aria-label="Open navigation"
 >
 <Menu className="h-5 w-5" />
 </Button>
 </div>

 <aside className="hidden min-h-[calc(100vh-2rem)] min-h-[calc(100dvh-2rem)] w-80 flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft lg:flex">
 <Logo compact />
 <nav className="mt-8 space-y-2">
 <NavList
 items={essentialItems}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, false)}
 />

 {moreItems.length > 0 ? (
 <>
 {isMoreExpanded ? (
 <div className="space-y-2 pt-1">
 <NavList
 items={moreItems}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, false)}
 />
 </div>
 ) : null}
 <button
 type="button"
 onClick={() => setShowMore((v) => !v)}
 className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-2xl px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
 >
 {isMoreExpanded ? (
 <>
 {tx("Show less", selectedLanguage)}
 <ChevronUp className="h-4 w-4" />
 </>
 ) : (
 <>
 {tx("More", selectedLanguage)}
 <ChevronDown className="h-4 w-4" />
 </>
 )}
 </button>
 </>
 ) : null}

 {settingsItem ? (
 <div className="border-t border-border/70 pt-2">
 <NavList
 items={[settingsItem]}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, false)}
 />
 </div>
 ) : null}
 </nav>
 <div className="mt-auto rounded-2xl border border-border/70 bg-background p-4">
 <p className="text-sm font-semibold text-foreground">{tx("Care Tip", selectedLanguage)}</p>
 <p className="mt-2 text-sm leading-6 text-muted-foreground">
 {tx("Keep urgent help, doctor visits, and learning easy to find.", selectedLanguage)}
 </p>
 </div>
 </aside>

 <AnimatePresence>
 {isSidebarOpen ? (
 <>
 <motion.button
 type="button"
 aria-label="Close navigation"
 className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setSidebarOpen(false)}
 />
 <motion.aside
 initial={{ x: -280 }}
 animate={{ x: 0 }}
 exit={{ x: -280 }}
 transition={{ type: "spring", stiffness: 260, damping: 26 }}
 className="safe-area-y fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-80 flex-col overflow-y-auto border-r border-border/70 bg-card p-5 shadow-2xl lg:hidden"
 >
 <Logo compact language={selectedLanguage} />
 <nav className="mt-8 space-y-2">
 <NavList
 items={essentialItems}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, true)}
 />

 {moreItems.length > 0 ? (
 <>
 {isMoreExpanded ? (
 <div className="space-y-2 pt-1">
 <NavList
 items={moreItems}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, true)}
 />
 </div>
 ) : null}
 <button
 type="button"
 onClick={() => setShowMore((v) => !v)}
 className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-2xl px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
 >
 {isMoreExpanded ? (
 <>
 {tx("Show less", selectedLanguage)}
 <ChevronUp className="h-4 w-4" />
 </>
 ) : (
 <>
 {tx("More", selectedLanguage)}
 <ChevronDown className="h-4 w-4" />
 </>
 )}
 </button>
 </>
 ) : null}

 {settingsItem ? (
 <div className="border-t border-border/70 pt-2">
 <NavList
 items={[settingsItem]}
 activeSection={activeSection}
 selectedLanguage={selectedLanguage}
 onSelect={(id) => selectAndMaybeClose(id, true)}
 />
 </div>
 ) : null}
 </nav>
 </motion.aside>
 </>
 ) : null}
 </AnimatePresence>
 </>
 );
}
