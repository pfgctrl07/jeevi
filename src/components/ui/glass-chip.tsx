import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const toneRing: Record<string, string> = {
  default: "ring-white/20",
  success: "ring-emerald-300/40",
  warning: "ring-amber-300/40",
  danger: "ring-rose-300/40",
};

const toneText: Record<string, string> = {
  default: "text-white",
  success: "text-emerald-200",
  warning: "text-amber-200",
  danger: "text-rose-200",
};

// A frosted glass tile for stats floating over a gradient hero — the same
// visual language as the sign-in page's floating chips.
export function GlassStat({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border border-white/20 bg-white/10 p-4 text-left shadow-lg backdrop-blur-md ring-1 transition",
        toneRing[tone],
        onClick && "hover:bg-white/15",
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={cn("mt-1.5 text-lg font-semibold", toneText[tone])}>{value}</p>
      {detail ? <p className="mt-0.5 text-xs text-white/60">{detail}</p> : null}
    </Comp>
  );
}

// Small pill badge — logins's trust/feature chips, reusable anywhere.
export function GlassPill({
  icon: Icon,
  label,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md",
        className,
      )}
    >
      <Icon className="h-4 w-4 text-white" />
      {label}
    </div>
  );
}
