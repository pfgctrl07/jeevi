import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLanguage, PriorityCard } from "@/lib/data";
import { t } from "@/lib/data";

type FeatureCardProps = {
  feature: PriorityCard;
  index: number;
  language: AppLanguage;
  onOpen: (featureId: PriorityCard["id"]) => void;
};

export function FeatureCard({
  feature,
  index,
  language,
  onOpen,
}: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-border/70 bg-card/88">
        <CardContent className="flex h-full flex-col p-5">
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent}`}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="mb-2 inline-flex w-fit rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs font-semibold text-muted-foreground">
            {t(feature.status, language)}
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {t(feature.title, language)}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t(feature.description, language)}
          </p>
          <Button
            className="mt-auto w-full justify-between"
            variant="outline"
            size="lg"
            onClick={() => onOpen(feature.id)}
          >
            {t(feature.buttonLabel, language)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
