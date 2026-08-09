import type { AppLanguage } from "@/lib/data";
import { tx } from "@/lib/data";

type LogoProps = {
  compact?: boolean;
  language?: AppLanguage;
};

export function Logo({ compact = false, language = "en" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/jeevitham-logo.jpeg"
        alt="Jeevitham logo"
        className={
          compact
            ? "block w-14 shrink-0 object-contain"
            : "block w-20 shrink-0 object-contain sm:w-24"
        }
      />
      <div>
        <p
          className={
            compact
              ? "text-xs font-semibold uppercase tracking-[0.28em] text-primary"
              : "text-sm font-semibold uppercase tracking-[0.28em] text-primary"
          }
        >
          Jeevitham
        </p>
        <p
          className={
            compact
              ? "text-sm leading-6 text-muted-foreground"
              : "text-lg leading-7 text-muted-foreground"
          }
        >
          Your Family Health
          <span className="block">{tx("Companion", language)}</span>
        </p>
      </div>
    </div>
  );
}
