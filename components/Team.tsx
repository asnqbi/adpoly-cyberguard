import { ArrowUpRight, Mail } from "lucide-react";
import { Github, Linkedin } from "./BrandIcons";
import { team, type Member } from "@/data/team";
import { SectionLabel, Tags } from "./ui";
export function MemberCard({
  member,
  index,
}: {
  member: Member;
  index: number;
}) {
  return (
    <article className="member-card">
      <div className="member-photo">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          width="400"
          height="400"
        />
        <span className="member-number">0{index + 1} / CYBERGUARD</span>
        <a
          href={`/team/${member.id}`}
          className="member-arrow"
          aria-label={`View ${member.name}'s profile`}
        >
          <ArrowUpRight size={22} />
        </a>
      </div>
      <div className="member-info">
        <p className="member-role">{member.role}</p>
        <h3>
          <a href={`/team/${member.id}`}>{member.name}</a>
        </h3>
        <p className="member-university">{member.university}</p>
        <p className="member-bio">{member.bio}</p>
        {member.skills.length > 0 ? (
          <Tags items={member.skills.slice(0, 3)} />
        ) : (
          <p className="profile-note">More about this member coming soon.</p>
        )}
        <div className="member-socials">
          {member.linkedin && (
            <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`}>
              <Linkedin size={17} />
            </a>
          )}
          {member.github && (
            <a href={member.github} aria-label={`${member.name} on GitHub`}>
              <Github size={17} />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
            >
              <Mail size={17} />
            </a>
          )}
          <a href={`/team/${member.id}`} className="profile-link">
            View profile <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
export default function Team() {
  return (
    <section id="team" className="section team-section">
      <div className="container reveal">
        <div className="section-heading">
          <div>
            <SectionLabel number="04">THE PEOPLE BEHIND THE WORK</SectionLabel>
            <h2>
              Three minds. <span className="muted">One mission.</span>
            </h2>
          </div>
          <p className="section-note">
            Different perspectives.
            <br />A shared drive to build and defend.
          </p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
