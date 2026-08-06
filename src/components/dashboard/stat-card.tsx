import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLanguage, SummaryItem } from "@/lib/data";
import { t } from "@/lib/data";
import { cn } from "@/lib/utils";

const toneClasses: Record<SummaryItem["tone"], string> = {
  primary: "bg-blue-500/15 text-blue-100 ring-blue-500/20",
  success: "bg-emerald-500/15 text-emerald-100 ring-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-100 ring-amber-500/20",
  danger: "bg-red-500/15 text-red-100 ring-red-500/20",
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
      <Card className="h-full overflow-hidden border-border/70 bg-card/88">
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
