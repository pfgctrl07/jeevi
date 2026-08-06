import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityItem, AppLanguage } from "@/lib/data";
import { t } from "@/lib/data";

export function ActivityTimeline({
  items,
  language,
}: {
  items: ActivityItem[];
  language: AppLanguage;
}) {
  return (
    <Card className="border-border/70 bg-card/88">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription className="text-muted-foreground">
          Recent care updates in a simple timeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              {index < items.length - 1 ? (
                <div className="mt-2 h-full w-px bg-border/70" />
              ) : null}
            </div>
            <div className="pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">
                  {t(item.title, language)}
                </p>
                <span className="rounded-full bg-background/72 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {t(item.time, language)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(item.detail, language)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
