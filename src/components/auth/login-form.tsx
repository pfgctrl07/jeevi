import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LockKeyhole, Mail, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/lib/api";

const ROLE_OPTIONS: Array<{ value: AuthUser["role"]; label: string }> = [
  { value: "parent", label: "Parent / Family" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital", label: "Hospital Desk" },
];

export function LoginForm() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@jeevitham.in");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState<AuthUser["role"]>("parent");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result =
      mode === "sign-in"
        ? await login(email, password)
        : await register(name, email, password, role);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-background p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => {
            setMode("sign-in");
            setError("");
          }}
          className={`rounded-full py-2 transition ${
            mode === "sign-in" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("sign-up");
            setError("");
          }}
          className={`rounded-full py-2 transition ${
            mode === "sign-up" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Create Account
        </button>
      </div>

      {mode === "sign-up" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Full name
          </label>
          <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 focus-within:border-primary">
            <User className="h-5 w-5 text-muted-foreground" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-full w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="email"
        >
          Email
        </label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 focus-within:border-primary">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-full w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 focus-within:border-primary">
          <LockKeyhole className="h-5 w-5 text-muted-foreground" />
          <input
            id="password"
            type="password"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Enter your password"
            minLength={mode === "sign-up" ? 6 : undefined}
            required
          />
        </div>
      </div>

      {mode === "sign-up" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="role">
            I am a
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value as AuthUser["role"])}
            className="h-12 w-full rounded-2xl border border-border/70 bg-background px-4 text-base text-foreground outline-none focus:border-primary"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <Button className="w-full rounded-full" size="lg" type="submit" disabled={isSubmitting}>
        <HeartPulse className="h-5 w-5" />
        {isSubmitting ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Create Account"}
      </Button>

      {mode === "sign-in" ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
          Demo login: <span className="font-semibold">admin@jeevitham.in</span> /{" "}
          <span className="font-semibold">123456</span>
        </div>
      ) : null}
    </form>
  );
}
