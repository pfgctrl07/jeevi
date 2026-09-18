import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { api, type Patient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { tx } from "@/lib/data";
import { useAppState } from "@/contexts/app-state-context";

type Verdict = {
  verdict: "SAFE" | "CAUTION" | "DANGER";
  summary: string;
  reasons: string[];
  sideEffects: string[];
};

const verdictStyles: Record<Verdict["verdict"], { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  SAFE: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-500", icon: CheckCircle2 },
  CAUTION: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-500", icon: AlertTriangle },
  DANGER: { bg: "bg-danger/10 border-danger/30", text: "text-danger", icon: ShieldAlert },
};

export function NutritionAnalyzer() {
  const { selectedLanguage } = useAppState();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [childId, setChildId] = useState<string>("");
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<Verdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPatients()
      .then((data) => {
        setPatients(data);
        if (data.length > 0) setChildId(data[0].id);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const verdict = await api.analyzeNutrition({ foodName, description, childId });
      setResult(verdict);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const style = result ? verdictStyles[result.verdict] : null;
  const Icon = style?.icon ?? Sparkles;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {patients.length > 0 ? (
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        ) : null}
        <input
          required
          placeholder={tx("Food or product name (e.g. Chocolate biscuit)", selectedLanguage)}
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder={tx("Any extra details (ingredients, brand, how often)", selectedLanguage)}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? tx("Analyzing…", selectedLanguage) : tx("Analyze with Jeevi AI", selectedLanguage)}
        </Button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {result && style ? (
        <div className={`space-y-2 rounded-2xl border p-4 ${style.bg}`}>
          <div className={`flex items-center gap-2 font-semibold ${style.text}`}>
            <Icon className="h-5 w-5" />
            {result.verdict}
          </div>
          <p className="text-sm text-foreground">{result.summary}</p>
          {result.reasons?.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : null}
          {result.sideEffects?.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{tx("Possible side effects:", selectedLanguage)}</span>{" "}
              {result.sideEffects.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
