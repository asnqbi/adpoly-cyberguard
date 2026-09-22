"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
export default function AdminLogin({ configured }: { configured: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error();
      window.location.assign("/admin/messages");
    } catch {
      setError("Unable to sign in. Check your credentials and admin access.");
      setPending(false);
    }
  }
  return (
    <main id="main" className="admin-login-page container">
      <a href="/" className="text-link">
        <ArrowLeft size={16} />
        Back to CyberGuard
      </a>
      <section className="admin-login-card">
        <ShieldCheck className="cyan" size={35} strokeWidth={1.4} />
        <span className="eyebrow">ADPOLY CYBERGUARD / TEAM ACCESS</span>
        <h1>Welcome back.</h1>
        <p>Sign in to review messages and connect with our community.</p>
        {!configured && (
          <div className="admin-notice" role="status">
            Admin sign-in is not configured yet. Follow the Supabase setup guide
            in the project to enable access.
          </div>
        )}
        <form onSubmit={submit} aria-busy={pending}>
          <label htmlFor="admin-email">
            Admin email
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              maxLength={254}
              required
            />
          </label>
          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={1024}
              required
            />
          </label>
          <button
            type="submit"
            className="button primary form-submit"
            disabled={pending || !configured}
          >
            {pending ? "Signing in…" : "Sign In"}
            {pending ? (
              <LoaderCircle size={18} className="spin" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
        </form>
        <p className="admin-login-note">
          Access is limited to approved ADPoly CyberGuard admins.
        </p>
      </section>
    </main>
  );
}
