import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLanguage, SummaryItem } from "@/lib/data";
import { t } from "@/lib/data";
import { cn } from "@/lib/utils";

const toneClasses: Record<SummaryItem["tone"], string> = {
  primary: "bg-primary/15 text-primary ring-primary/25",
  success: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-200",
  warning: "bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-200",
  danger: "bg-red-500/15 text-red-700 ring-red-500/25 dark:text-red-200",
};

export function StatCard({
  item,
  index,
  language,
}: {
  item: SummaryItem;
  index: number;
  language: AppLanguage;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="h-full overflow-hidden border-border/70 bg-card">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div
            className={cn(
              "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1",
              toneClasses[item.tone],
            )}
          >
            {t(item.title, language)}
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">
              {t(item.value, language)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t(item.supporting, language)}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
