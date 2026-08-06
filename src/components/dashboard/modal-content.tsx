import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  modalContentMap,
  t,
  type AppLanguage,
  type ModalContent,
  type SectionKey,
} from "@/lib/data";

function ListRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 py-3">
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-right text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function toneClass(tone: ModalContent["tone"]) {
  switch (tone) {
    case "success":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-100";
    case "warning":
      return "border-amber-500/20 bg-amber-500/10 text-amber-100";
    case "danger":
      return "border-red-500/20 bg-red-500/10 text-red-100";
    default:
      return "border-primary/20 bg-primary/10 text-blue-100";
  }
}

export function getModalContent(
  section: SectionKey,
  language: AppLanguage,
): { title: string; description: string; body: ReactNode } | null {
  if (section === "dashboard") {
    return null;
  }

  const content = modalContentMap[section];

  return {
    title: t(content.title, language),
    description: t(content.description, language),
    body: (
      <div className="space-y-4">
        {content.items ? (
          <div className="space-y-3">
            {content.items.map((item) => (
              <ListRow
                key={t(item.label, language)}
                title={t(item.label, language)}
                detail={t(item.value, language)}
              />
            ))}
          </div>
        ) : null}

        {content.cards ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {content.cards.map((card) => (
              <Card
                key={t(card.title, language)}
                className={`shadow-none ${toneClass(card.tone as ModalContent["tone"])}`}
              >
                <CardContent className="space-y-2 p-5">
                  <p className="font-semibold">{t(card.title, language)}</p>
                  <p className="text-sm leading-6 text-current/80">
                    {t(card.detail, language)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {content.note ? (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass(content.tone)}`}>
            {t(content.note, language)}
          </div>
        ) : null}
      </div>
    ),
  };
}
