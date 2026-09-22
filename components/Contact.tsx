"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  LoaderCircle,
  Mail,
} from "lucide-react";
import { Github, Linkedin } from "./BrandIcons";
import { site } from "@/data/site";
import { SectionLabel } from "./ui";
import {
  CONTACT_ERROR,
  CONTACT_SUCCESS,
  CONTACT_SUBJECTS,
} from "@/lib/contact";
export default function Contact() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(
      ["name", "organization", "email", "subject", "message"].map((key) => [
        key,
        String(data.get(key) || "").trim(),
      ]),
    );
    setPending(true);
    setStatus("");
    setFailed(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error("Submission failed");
      form.reset();
      setStatus(CONTACT_SUCCESS);
    } catch {
      setFailed(true);
      setStatus(CONTACT_ERROR);
    } finally {
      setPending(false);
    }
  }
  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid reveal">
        <div>
          <SectionLabel number="08">LET’S CONNECT</SectionLabel>
          <h2>
            The next challenge
            <br />
            starts with <span className="cyan">a conversation.</span>
          </h2>
          <p>
            Interested in collaborating, inviting our team to a competition, or
            learning more about our projects? Get in touch with ADPoly
            CyberGuard.
          </p>
          <div className="contact-links">
            {[
              {
                label: "Email",
                value: site.email,
                href: `mailto:${site.email}`,
                icon: Mail,
              },
              {
                label: "LinkedIn",
                value: site.linkedin,
                href: site.linkedin,
                icon: Linkedin,
              },
              {
                label: "GitHub",
                value: site.github,
                href: site.github,
                icon: Github,
              },
            ].map(({ label, value, href, icon: Icon }) =>
              value ? (
                <a href={href} key={label}>
                  <Icon size={19} />
                  <span>
                    {label}
                    <small>
                      {label === "Email" ? value : "ADPoly CyberGuard"}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              ) : (
                <div key={label}>
                  <Icon size={19} />
                  <span>
                    {label}
                    <small>Coming soon</small>
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="contact-footnote">
            <span className="status-dot" />
            Based in the UAE. Open to new challenges.
          </div>
        </div>
        <form className="contact-form" onSubmit={submit} aria-busy={pending}>
          <h3>Connect with ADPoly CyberGuard</h3>
          <p>
            Send a message to our team about your next competition,
            collaboration, or project.
          </p>
          <div className="form-row">
            <label htmlFor="name">
              Your name <span aria-hidden="true">*</span>
              <input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                maxLength={120}
                disabled={pending}
                required
              />
            </label>
            <label htmlFor="organization">
              Organization
              <input
                id="organization"
                name="organization"
                autoComplete="organization"
                placeholder="Company or university"
                maxLength={180}
                disabled={pending}
              />
            </label>
          </div>
          <label htmlFor="email">
            Email address <span aria-hidden="true">*</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@organization.com"
              maxLength={254}
              disabled={pending}
              required
            />
          </label>
          <label htmlFor="subject">
            Subject <span aria-hidden="true">*</span>
            <select
              id="subject"
              name="subject"
              defaultValue=""
              required
              disabled={pending}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {CONTACT_SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label htmlFor="message">
            Your message <span aria-hidden="true">*</span>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us what you have in mind…"
              maxLength={5000}
              disabled={pending}
              required
            />
          </label>
          <button
            className="button primary form-submit"
            type="submit"
            disabled={pending}
          >
            {pending ? "Sending…" : "Send Message"}
            {pending ? (
              <LoaderCircle size={18} className="spin" />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </button>
          <p className="form-note">
            Your details are saved for the ADPoly CyberGuard team to review and
            respond.
          </p>
          {status && (
            <div
              className={`form-status${failed ? " is-error" : ""}`}
              role={failed ? "alert" : "status"}
            >
              {failed ? <CircleAlert size={17} /> : <Check size={17} />}
              <p>{status}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
