import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SocialSync" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const finalName = name.trim() || email.split("@")[0] || "User";
      const user = saveCurrentUser({ name: finalName, email });
      toast.success(`Signed in as ${user.name}`);

      if (import.meta.env.VITE_SUPABASE_URL && password) {
        supabase.auth.signInWithPassword({ email, password }).catch((err) => {
          console.warn("Supabase auth warning:", err);
        });
      }

      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to keep your social calendar in motion."
      footer={
        <>
          New to SocialSync?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}