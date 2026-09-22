import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Globe2,
  ShieldCheck,
  Trophy,
} from "lucide-react";
export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-grid" />
      <div className="container hero-main">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> STUDENT MINDS. REAL-WORLD IMPACT.
          </div>
          <h1>
            ADPoly
            <br />
            <span>
              CyberGuard<span className="cyan">.</span>
            </span>
          </h1>
          <p className="hero-tagline">
            Cybersecurity. AI. <span>Innovation.</span>
          </p>
          <p className="hero-description">
            A cybersecurity and technology competition team representing Abu
            Dhabi Polytechnic, building practical solutions for real-world
            security and AI challenges.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#achievements">
              View Our Achievements <ArrowUpRight size={18} />
            </a>
            <a className="button secondary" href="#team">
              Meet The Team <ArrowRight size={17} />
            </a>
          </div>
          <a className="hero-project-link" href="#projects">
            Explore what we’re building <ArrowUpRight size={15} />
          </a>
          <div className="hero-location">
            <Globe2 size={15} />
            <span>Abu Dhabi, United Arab Emirates</span>
            <span className="uae-flag" aria-label="UAE flag" />
          </div>
        </div>
        <div className="hero-art" aria-label="CyberGuard team identity">
          <div className="orbital orbital-one" />
          <div className="orbital orbital-two" />
          <div className="orbital orbital-three" />
          <div className="art-cross cross-one">+</div>
          <div className="art-cross cross-two">+</div>
          <div className="orbit-point point-one" />
          <div className="orbit-point point-two" />
          <div className="art-coordinate">
            ADPOLY / CYBERGUARD <span>UNITED ARAB EMIRATES</span>
          </div>
          <div className="art-core">
            <img
              src="/assets/team-logo.png"
              alt="CyberGuard shield and falcon logo"
            />
          </div>
          <div className="art-chip chip-top">
            <ShieldCheck size={17} />
            <span>DEFEND. BUILD. INNOVATE.</span>
          </div>
          <a className="award-float" href="#achievements">
            <span className="award-icon">
              <Trophy size={23} />
            </span>
            <span>
              <small>GISEC GLOBAL 2026</small>
              <strong>
                3rd Place <span>↗</span>
              </strong>
              <span>School of Cyber Defense</span>
            </span>
          </a>
          <span className="art-caption">SECURING WHAT COMES NEXT</span>
        </div>
      </div>
      <div className="hero-bottom container">
        <span>DRIVEN BY CURIOSITY. UNITED BY PURPOSE.</span>
        <a href="#about">
          Discover our team <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}
