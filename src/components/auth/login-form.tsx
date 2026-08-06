import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@jeevitham.in");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = login(email, password);

    if (!success) {
      setError("Please check the email and password, then try again.");
      return;
    }

    setError("");
    navigate("/dashboard", { replace: true });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="email"
        >
          Email
        </label>
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 focus-within:border-primary">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-full w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Enter your email"
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
        <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 focus-within:border-primary">
          <LockKeyhole className="h-5 w-5 text-muted-foreground" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <Button className="w-full" size="lg" type="submit">
        <HeartPulse className="h-5 w-5" />
        Sign In
      </Button>

      <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
        Demo login: <span className="font-semibold">admin@jeevitham.in</span> /{" "}
        <span className="font-semibold">123456</span>
      </div>
    </form>
  );
}
