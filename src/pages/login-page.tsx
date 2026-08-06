import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/dashboard/logo";

export function LoginPage() {
  return (
    <main className="min-h-screen bg-hero-glow px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden rounded-[2.2rem] border border-border/70 bg-card/88 p-8 shadow-soft backdrop-blur lg:block"
        >
          <Logo />
          <div className="mt-12 max-w-xl">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Family-centered healthcare
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-foreground">
              Jeevitham makes family healthcare feel clear, calm, and trusted.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Keep the next vaccine, next appointment, urgent help, and learning support easy to understand.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Card className="border-primary/15 bg-primary/10 shadow-none">
              <CardContent className="space-y-3 p-5">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Trusted reminders</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Vaccines and visits stay visible first.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/15 bg-emerald-500/10 shadow-none">
              <CardContent className="space-y-3 p-5">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
                <h2 className="text-lg font-semibold text-foreground">Care for every family</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Simple enough for first-time users and ready for professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-xl"
        >
          <Card className="border-border/70 bg-card/88 shadow-soft">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex justify-center lg:hidden">
                  <Logo compact />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary">
                  Welcome
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground">
                  Sign in to Jeevitham
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your Family Health Companion
                </p>
              </div>
              <LoginForm />
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}
