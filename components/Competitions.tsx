"use client";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Flag, Trophy, Users } from "lucide-react";
import { categories, competitions, type Category } from "@/data/competitions";
import { SectionLabel, Tags } from "./ui";
export default function Competitions() {
  const [active, setActive] = useState<Category>("All");
  const filtered = competitions.filter(
    (c) => active === "All" || c.categories.includes(active),
  );
  return (
    <section id="competitions" className="section container reveal">
      <div className="section-heading">
        <div>
          <SectionLabel number="05">CHALLENGE ACCEPTED</SectionLabel>
          <h2>
            Competitions <span className="muted">& challenges.</span>
          </h2>
        </div>
        <p className="section-note">Where knowledge meets the real world.</p>
      </div>
      <p className="section-intro">
        We take on cybersecurity, AI, technology, and innovation challenges to
        put our skills to the test and keep moving forward.
      </p>
      <div className="filters" role="group" aria-label="Filter competitions">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={c === active}
            onClick={() => setActive(c)}
            className={c === active ? "active" : ""}
          >
            {c}
            {c === "All" && (
              <span>{competitions.length.toString().padStart(2, "0")}</span>
            )}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {filtered.length ? (
          filtered.map((c) => (
            <article className="competition-card" key={c.name}>
              <div className="competition-symbol">
                <Flag size={28} strokeWidth={1.4} />
              </div>
              <div className="competition-main">
                <div className="eyebrow">
                  {c.event.toUpperCase()} {c.date}
                </div>
                <h3>{c.name}</h3>
                <p>{c.project}</p>
                <div className="competition-meta">
                  <span>
                    <CalendarDays size={14} />
                    {c.date}
                  </span>
                  <span>
                    <Users size={14} />
                    {c.members.length} team members
                  </span>
                  {c.location && <span>{c.location}</span>}
                  {c.organizer && <span>{c.organizer}</span>}
                </div>
                <Tags items={c.categories} />
                <details>
                  <summary>Team & event details</summary>
                  <p>{c.members.join(" · ")}</p>
                  <p>
                    Organizer: {c.organizer || "To be added"} · Exact date:{" "}
                    {c.exactDate || "To be added"} · Location:{" "}
                    {c.location || "To be added"}
                  </p>
                  {c.website ? (
                    <a className="text-link" href={c.website}>
                      Competition website <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <p>Competition website: To be added</p>
                  )}
                </details>
              </div>
              <div className="competition-result">
                <span>
                  <Trophy size={16} />
                  {c.result}
                </span>
                {c.projectLink && (
                  <a href={c.projectLink}>
                    View project <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Flag size={26} />
            <h3>Our next challenge is ahead.</h3>
            <p>
              No {active} competitions have been added yet. Check back for
              future updates.
            </p>
            <button className="text-link" onClick={() => setActive("All")}>
              View all competitions <ArrowUpRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
