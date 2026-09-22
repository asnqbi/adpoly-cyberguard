import { SectionLabel } from "./ui";
export default function About() {
  return (
    <section id="about" className="section container reveal">
      <div className="about-grid">
        <div>
          <SectionLabel number="01">WHO WE ARE</SectionLabel>
          <h2>
            Learning by doing.
            <br />
            <span className="muted">Competing with purpose.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            We are <strong>ADPoly CyberGuard</strong> — a student cybersecurity
            and technology team representing Abu Dhabi Polytechnic.
          </p>
          <p>
            From cyber defense and CTFs to AI challenges and hackathons, we turn
            technical knowledge into practical solutions. Our interests span
            offensive and defensive security, AI security, network security,
            threat detection, automation, and secure system design.
          </p>
          <p>
            Every challenge is an opportunity to sharpen our skills, learn
            together, and solve problems that matter.
          </p>
        </div>
      </div>
      <div className="stats-grid">
        <div>
          <strong data-count="3">
            3<span> / </span>
          </strong>
          <span>Core team members</span>
        </div>
        <div>
          <strong>
            3<sup>rd</sup>
          </strong>
          <span>School of Cyber Defense 2026</span>
        </div>
        <div>
          <strong className="stat-text">
            Cybersecurity <span>+ AI</span>
          </strong>
          <span>Our primary focus</span>
        </div>
        <div>
          <strong>
            UAE<span className="stat-dot">●</span>
          </strong>
          <span>Based in the United Arab Emirates</span>
        </div>
      </div>
    </section>
  );
}
