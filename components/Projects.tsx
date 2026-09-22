import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { SectionLabel, Tags } from "./ui";
export function Architecture({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={detailed ? "architecture detailed" : "architecture"}>
      <div className="diagram-label">
        <span className="status-dot" />
        CONCEPTUAL DEFENSE WORKFLOW
      </div>
      <div className="architecture-server">
        <Cpu size={36} strokeWidth={1.2} />
        <span>AI inference server</span>
        <small>RESILIENCE BY DESIGN</small>
      </div>
      <div className="diagram-connector" />
      <div className="architecture-nodes">
        {[
          { icon: Activity, title: "Monitor" },
          { icon: Radar, title: "Detect" },
          { icon: ShieldCheck, title: "Mitigate" },
        ].map(({ icon: Icon, title }) => (
          <div key={title}>
            <Icon size={21} />
            <span>{title}</span>
          </div>
        ))}
      </div>
      <div className="diagram-footer">
        <span>01 / STRESS-TEST</span>
        <ArrowRight size={13} />
        <span>02 / ADAPT & DEFEND</span>
      </div>
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Architecture />
      <div className="project-content">
        <div className="eyebrow">
          FEATURED PROJECT <span className="mini-line" /> {project.year}
        </div>
        <h3>{project.shortTitle}</h3>
        <p>{project.title}</p>
        <p className="subtle">{project.description}</p>
        <Tags items={project.category.split(" / ")} />
        <a className="text-link" href={`/projects/${project.id}`}>
          Explore the project <ArrowUpRight size={17} />
        </a>
      </div>
    </article>
  );
}
export default function Projects() {
  return (
    <section id="projects" className="section container reveal">
      <div className="section-heading">
        <div>
          <SectionLabel number="03">BUILT TO SOLVE</SectionLabel>
          <h2>
            Ideas into <span className="muted">real-world solutions.</span>
          </h2>
        </div>
        <span className="section-note">Research. Build. Test. Improve.</span>
      </div>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </section>
  );
}
