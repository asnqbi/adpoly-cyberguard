import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Trophy } from "lucide-react";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Architecture } from "@/components/Projects";
import { Tags } from "@/components/ui";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.id === slug);
  return {
    title: p?.title || "Project not found",
    description: p?.description,
    alternates: { canonical: `/projects/${slug}` },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();
  return (
    <>
      <Navbar subpage />
      <main id="main" className="container detail-page">
        <a className="text-link" href="/#projects">
          <ArrowLeft size={16} />
          Back to projects
        </a>
        <div className="eyebrow detail-eyebrow">{project.category}</div>
        <h1>{project.title}</h1>
        <p className="detail-lead">{project.description}</p>
        <Tags items={project.areas} />
        <div className="detail-grid">
          <article>
            <section>
              <span className="detail-number">01 / THE CHALLENGE</span>
              <h2>Problem</h2>
              <p>{project.problem}</p>
            </section>
            <section>
              <span className="detail-number">02 / OUR APPROACH</span>
              <h2>Solution</h2>
              <p>{project.solution}</p>
            </section>
          </article>
          <Architecture detailed />
        </div>
        <section className="detail-section">
          <span className="detail-number">03 / SYSTEM DESIGN</span>
          <h2>Architecture</h2>
          <p>
            A conceptual overview of the project’s defense workflow. Detailed
            implementation diagrams and screenshots will be added when
            available.
          </p>
          <ol className="workflow">
            {project.architecture.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          {project.images.map((img) => (
            <img
              className="project-upload"
              key={img.src}
              src={img.src}
              alt={img.alt}
            />
          ))}
        </section>
        <div className="detail-two-column">
          <section>
            <span className="detail-number">04 / TOOLKIT</span>
            <h2>Technologies</h2>
            {project.technologies.length ? (
              <Tags items={project.technologies} />
            ) : (
              <p>
                The implementation stack has not been published yet. Technology
                details will be added after team review.
              </p>
            )}
          </section>
          <section>
            <span className="detail-number">05 / OUTCOME</span>
            <h2>Results</h2>
            <p>{project.results}</p>
          </section>
        </div>
        <section className="project-competition">
          <Trophy size={32} />
          <div>
            <span className="eyebrow gold">COMPETITION</span>
            <h2>{project.competition}</h2>
            <p>{project.placement} · Representing Abu Dhabi Polytechnic</p>
          </div>
          <a className="text-link" href="/#achievements">
            View achievement <ArrowUpRight size={17} />
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
