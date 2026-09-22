"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/data/site";
export default function Navbar({ subpage = false }: { subpage?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const link = (label: string) =>
    `${subpage ? "/" : ""}#${label.toLowerCase()}`;
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a
          href={link("Home")}
          className="brand"
          aria-label="ADPoly CyberGuard home"
        >
          <span className="brand-symbol">
            <img src="/assets/team-logo.png" alt="" />
          </span>
          <span>
            <span className="brand-top">ADPOLY</span>
            <strong>
              CyberGuard<span className="cyan">.</span>
            </strong>
          </span>
        </a>
        <nav
          className={open ? "navigation is-open" : "navigation"}
          id="main-navigation"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a key={item} href={link(item)} onClick={() => setOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href={link("Achievements")}>
          Our Achievements <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
