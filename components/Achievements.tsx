import { Trophy, ArrowUpRight } from "lucide-react";
import { achievements, type Achievement } from "@/data/achievements";
import { SectionLabel } from "./ui";
export function AchievementCard({
  achievement: a,
}: {
  achievement: Achievement;
}) {
  return (
    <article className="achievement-card">
      <div className="achievement-medal">
        <div className="medal-ring">
          <Trophy size={46} strokeWidth={1.2} />
          <strong>{a.placement.split(" ")[0]}</strong>
          <span>PLACE</span>
        </div>
        <span className="medal-caption">SCHOOL OF CYBER DEFENSE</span>
      </div>
      <div className="achievement-content">
        <div className="eyebrow gold">
          {a.organization.toUpperCase()}
          <span className="mini-line" />
          {a.year}
        </div>
        <h3>
          {a.placement}.<br />A shared achievement.
        </h3>
        <p className="achievement-event">{a.competition}</p>
        <p>{a.description}</p>
        <div className="achievement-project">
          <span>THE PROJECT</span>
          <strong>{a.project}</strong>
        </div>
        <a className="text-link" href={a.link}>
          View Project <ArrowUpRight size={17} />
        </a>
      </div>
    </article>
  );
}
export default function Achievements() {
  return (
    <section id="achievements" className="section achievements-section">
      <div className="container reveal">
        <div className="section-heading">
          <div>
            <SectionLabel number="02">OUR MILESTONES</SectionLabel>
            <h2>
              Small team. <span className="muted">Meaningful impact.</span>
            </h2>
          </div>
          <span className="section-note">
            Progress, one challenge at a time.
          </span>
        </div>
        <div className="timeline">
          {achievements.map((a) => (
            <div className="timeline-entry" key={`${a.year}-${a.competition}`}>
              <div className="timeline-year">
                <span />
                {a.year}
              </div>
              <AchievementCard achievement={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
