import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarItems, t } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAppState } from "@/contexts/app-state-context";
import { Logo } from "./logo";

export function Sidebar() {
  const {
    activeSection,
    setActiveSection,
    isSidebarOpen,
    setSidebarOpen,
    selectedLanguage,
    selectedRole,
  } = useAppState();
  const visibleItems = sidebarItems.filter((item) =>
    item.roles.includes(selectedRole),
  );

  return (
    <>
      <div className="flex items-center justify-between rounded-[1.6rem] border border-border/70 bg-card/88 p-4 shadow-soft backdrop-blur lg:hidden">
        <Logo compact />
        <Button
          variant="outline"
          size="icon"
          className="border-border/70 bg-background/70 text-foreground hover:bg-muted"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <aside className="hidden min-h-[calc(100vh-2rem)] w-80 flex-col rounded-[2rem] border border-border/70 bg-card/88 p-5 shadow-soft backdrop-blur lg:flex">
        <Logo compact />
        <nav className="mt-8 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
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
        </nav>
        <div className="mt-auto rounded-2xl border border-border/70 bg-background/70 p-4">
          <p className="text-sm font-semibold text-foreground">Care Tip</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Keep urgent help, doctor visits, and learning easy to find.
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
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-80 flex-col border-r border-border/70 bg-card p-5 shadow-2xl lg:hidden"
            >
              <Logo compact />
              <nav className="mt-8 space-y-2">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeSection;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
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
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
