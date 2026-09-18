import * as React from "react";
import { cn } from "@/lib/utils";

// Plain grouped-list primitives — one bordered container, hairline-divided
// rows inside. No shadows, no per-item cards. This is the building block
// for the whole app now instead of card grids.

export function ListSection({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      {title ? (
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className="divide-y divide-border/70 rounded-md border border-border/70 bg-card">
        {children}
      </div>
    </section>
  );
}

export function ListRow({
  icon: Icon,
  label,
  value,
  detail,
  onClick,
  trailing,
  tone,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  value?: React.ReactNode;
  detail?: React.ReactNode;
  onClick?: () => void;
  trailing?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneText: Record<string, string> = {
    default: "text-foreground",
    success: "text-emerald-700 dark:text-emerald-300",
    warning: "text-amber-700 dark:text-amber-300",
    danger: "text-danger",
  };

  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left",
        onClick && "transition hover:bg-muted",
      )}
    >
      {Icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {detail ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
        ) : null}
      </div>
      {value ? (
        <p className={cn("shrink-0 text-sm font-medium", toneText[tone ?? "default"])}>
          {value}
        </p>
      ) : null}
      {trailing}
    </Comp>
  );
}
