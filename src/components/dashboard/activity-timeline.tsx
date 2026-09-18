import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Pencil, Sparkles, Trash2, UserPlus } from "lucide-react";
import { ListRow, ListSection } from "@/components/ui/list";
import { tx } from "@/lib/data";
import { api, type ActivityEntry } from "@/lib/api";
import { useAppState } from "@/contexts/app-state-context";

const iconByType: Record<string, typeof CheckCircle2> = {
  patient_added: UserPlus,
  patient_updated: Pencil,
  patient_removed: Trash2,
  ai_chat: Bot,
  nutrition_check: Sparkles,
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function ActivityTimeline() {
  const { selectedLanguage } = useAppState();
  const [items, setItems] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      api
        .getActivities()
        .then((data) => {
          if (!cancelled) setItems(data);
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    refresh();
    // Poll rather than push (no websocket backend) so actions taken
    // elsewhere in the app — adding a patient, running a nutrition check —
    // show up here without needing a manual page reload.
    const interval = setInterval(refresh, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <ListSection
      title={tx("Recent Activities", selectedLanguage)}
      description={tx("Real actions taken in the app, most recent first.", selectedLanguage)}
    >
      {loading ? (
        <div className="px-4 py-3 text-sm text-muted-foreground">{tx("Loading…", selectedLanguage)}</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          {tx("Nothing has happened yet — add a patient, ask Jeevi a question, or run a nutrition check to see it here.", selectedLanguage)}
        </div>
      ) : (
        items.map((item) => (
          <ListRow
            key={item.id}
            icon={iconByType[item.type] ?? CheckCircle2}
            label={item.title}
            detail={item.detail}
            value={formatRelativeTime(item.time)}
          />
        ))
      )}
    </ListSection>
  );
}
