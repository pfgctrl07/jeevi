import { useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Play, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { learningShelves, t, tx, type AppLanguage, type LearningLesson } from "@/lib/data";

export function LearningPrototype({ language }: { language: AppLanguage }) {
  const [activeLesson, setActiveLesson] = useState<LearningLesson | null>(null);

  return (
    <>
      <div className="space-y-6">
        {learningShelves.map((shelf) => (
          <section key={shelf.title.en} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t(shelf.title, language)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tx("Dummy educational content for the product prototype.", language)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {shelf.lessons.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveLesson(lesson)}
                  className="group overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-soft transition hover:-translate-y-1 hover:shadow-panel"
                >
                  <div
                    className={`relative h-44 bg-gradient-to-br ${lesson.gradient} p-5`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700">
                        {tx("Prototype", language)}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-lg">
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t(lesson.category, language)}
                      </div>
                      <h4 className="max-w-[15rem] text-lg font-semibold leading-6 text-slate-900">
                        {t(lesson.title, language)}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" />
                      {t(lesson.duration, language)}
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {t(lesson.description, language)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Modal
        open={Boolean(activeLesson)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveLesson(null);
          }
        }}
        title={activeLesson ? t(activeLesson.title, language) : ""}
        description={activeLesson ? t(activeLesson.category, language) : ""}
      >
        {activeLesson ? (
          <div className="space-y-5">
            <div
              className={`relative h-56 rounded-xl bg-gradient-to-br ${activeLesson.gradient} p-6`}
            >
              <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700">
                {tx("Prototype", language)}
              </span>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm font-medium text-slate-700">
                  {t(activeLesson.category, language)} · {t(activeLesson.duration, language)}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {t(activeLesson.title, language)}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              {t(activeLesson.description, language)}
            </p>

            <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-4 text-sm leading-7 text-foreground">
              {tx("This educational content is currently a prototype. Video content will be available in future versions.", language)}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
