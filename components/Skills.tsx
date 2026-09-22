import {
  BrainCircuit,
  Code2,
  Network,
  ScanSearch,
  ShieldCheck,
  Target,
} from "lucide-react";
import { expertise } from "@/data/site";
import { SectionLabel } from "./ui";
const icons = {
  target: Target,
  shield: ShieldCheck,
  brain: BrainCircuit,
  scan: ScanSearch,
  network: Network,
  code: Code2,
};
export default function Skills() {
  return (
    <section className="section skills-section" id="expertise">
      <div className="container reveal">
        <SectionLabel number="06">OUR AREAS OF FOCUS</SectionLabel>
        <h2>
          Curiosity across <span className="muted">the security spectrum.</span>
        </h2>
        <p className="section-intro">
          The disciplines we explore, practice, and keep developing together.
        </p>
        <div className="skills-grid">
          {expertise.map((e, i) => {
            const Icon = icons[e.icon as keyof typeof icons];
            return (
              <article className="skill-card" key={e.title}>
                <div className="skill-top">
                  <Icon size={25} strokeWidth={1.4} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
                <ul>
                  {e.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
