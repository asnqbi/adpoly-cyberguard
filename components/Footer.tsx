import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
export default function Footer() {
  return (
    <footer className="container site-footer">
      <div className="footer-top">
        <div>
          <a href="/#home" className="footer-brand">
            ADPoly CyberGuard<span className="cyan">.</span>
          </a>
          <p>
            Cybersecurity <span>·</span> AI <span>·</span> Innovation
          </p>
          <small>Representing Abu Dhabi Polytechnic</small>
        </div>
        <div className="footer-links">
          <a href="/#team">
            The team <ArrowUpRight size={14} />
          </a>
          <a href="/#projects">
            Our projects <ArrowUpRight size={14} />
          </a>
          <a href="/#contact">
            Get in touch <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ADPoly CyberGuard. All rights reserved.</span>
        <div>
          {[
            { label: "LinkedIn", url: site.linkedin },
            { label: "GitHub", url: site.github },
            { label: "Email", url: site.email ? `mailto:${site.email}` : "" },
          ].map((l) =>
            l.url ? (
              <a href={l.url} key={l.label}>
                {l.label}
                <ArrowUpRight size={12} />
              </a>
            ) : (
              <span key={l.label} title="Contact details coming soon">
                {l.label} <small>soon</small>
              </span>
            ),
          )}
        </div>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
