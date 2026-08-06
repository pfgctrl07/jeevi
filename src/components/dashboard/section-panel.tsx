import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { moduleSections, t, type SectionKey } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";
import { LearningPrototype } from "./learning-prototype";

export function SectionPanel({ section }: { section: SectionKey }) {
  const { selectedLanguage } = useAppState();
  const meta = moduleSections[section];
  const Icon = meta.icon;

  return (
    <Card className="border-border/70 bg-card/88 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>{t(meta.title, selectedLanguage)}</CardTitle>
            <CardDescription>{t(meta.description, selectedLanguage)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {section === "learning" ? (
          <LearningPrototype language={selectedLanguage} />
        ) : null}

        {section !== "learning" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {meta.highlights.map((item) => {
              const HighlightIcon = item.icon;

              return (
                <div
                  key={t(item.title, selectedLanguage)}
                  className="rounded-2xl border border-border/70 bg-background/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-soft">
                      <HighlightIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(item.title, selectedLanguage)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(item.detail, selectedLanguage)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {meta.emptyState ? (
          <EmptyState
            title={t(meta.emptyState.title, selectedLanguage)}
            description={t(meta.emptyState.description, selectedLanguage)}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
