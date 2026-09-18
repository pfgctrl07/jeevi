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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="h-full"
    >
      <Card className="h-full border-border/70 bg-card">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {t(feature.title, language)}
            </h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {t(feature.description, language)}
          </p>
          <Button
            className="mt-4 w-full justify-between"
            variant="outline"
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
