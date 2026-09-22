import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/BrandIcons";
import { team } from "@/data/team";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tags } from "@/components/ui";
export function generateStaticParams() {
  return team.map((m) => ({ slug: m.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = team.find((m) => m.id === slug);
  return {
    title: member?.name || "Member not found",
    description: member?.bio,
    alternates: { canonical: `/team/${slug}` },
  };
}
export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = team.find((m) => m.id === slug);
  if (!member) notFound();
  return (
    <>
      <Navbar subpage />
      <main id="main" className="container detail-page">
        <a className="text-link" href="/#team">
          <ArrowLeft size={16} />
          Back to the team
        </a>
        <div className="profile-page-grid">
          <div className="profile-portrait">
            <img
              src={member.image}
              alt={member.name}
              width="600"
              height="600"
            />
          </div>
          <div>
            <div className="eyebrow">THE PEOPLE BEHIND CYBERGUARD</div>
            <h1>{member.name}</h1>
            <p className="profile-page-role">{member.role}</p>
            <p className="muted">{member.university}</p>
            <section>
              <h2>About</h2>
              <p>{member.bio}</p>
            </section>
            <section>
              <h2>Skills & interests</h2>
              {member.skills.length ? (
                <Tags items={member.skills} />
              ) : (
                <p>Skills and interests will be added soon.</p>
              )}
            </section>
            <section>
              <h2>Certifications</h2>
              {member.certifications.length ? (
                <Tags items={member.certifications} />
              ) : (
                <p>Certification details have not been added.</p>
              )}
            </section>
            <section>
              <h2>Connect</h2>
              <div className="profile-connect">
                {member.linkedin && (
                  <a className="text-link" href={member.linkedin}>
                    <Linkedin size={17} />
                    LinkedIn
                  </a>
                )}
                {member.github && (
                  <a className="text-link" href={member.github}>
                    <Github size={17} />
                    GitHub
                  </a>
                )}
                {member.email && (
                  <a className="text-link" href={`mailto:${member.email}`}>
                    <Mail size={17} />
                    Email
                  </a>
                )}
                {!member.linkedin && !member.github && !member.email && (
                  <p>Contact links coming soon.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
