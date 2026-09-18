import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Syringe } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

function GlassChip({
  icon: Icon,
  label,
  className,
}: {
  icon: typeof ShieldCheck;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      <Icon className="h-4 w-4 text-white" />
      {label}
    </div>
  );
}

export function LoginPage() {
  return (
    <main className="auth-hero relative min-h-screen min-h-[100dvh] overflow-hidden">
      {/* Decorative brand mark, faded into the gradient — no stock photography of people. */}
      <img
        src="/jeevitham-logo.jpeg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden w-[42rem] -translate-y-1/2 rounded-full opacity-[0.12] mix-blend-luminosity lg:block"
      />

      <div className="relative mx-auto flex min-h-screen min-h-[100dvh] max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/jeevitham-logo.jpeg" alt="Jeevitham" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Jeevitham</p>
            <p className="text-xs text-white/60">Your Family Health Companion</p>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md">
              Rajalakshmi HealthCity launch partner
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
              Your trusted partner in modern child healthcare.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">
              Vaccination tracking, AI nutrition safety checks, and hospital records —
              one calm, clear place for every family.
            </p>

            <a
              href="#sign-in"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2.5 pl-6 pr-2.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-white/90"
            >
              Sign in to continue
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            <div className="mt-10 flex flex-wrap gap-3">
              <GlassChip icon={Syringe} label="Real-time vaccine tracking" />
              <GlassChip icon={Sparkles} label="AI nutrition safety checks" />
              <GlassChip icon={ShieldCheck} label="EN · தமிழ் · हिंदी" />
            </div>
          </motion.section>

          <motion.section
            id="sign-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto w-full max-w-md scroll-mt-10 rounded-2xl border border-white/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="mb-8 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">Welcome</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">Sign in to Jeevitham</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Your Family Health Companion</p>
            </div>
            <LoginForm />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
