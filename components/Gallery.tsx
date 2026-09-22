"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { gallery } from "@/data/gallery";
import { SectionLabel } from "./ui";
export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const close = () => dialog.current?.close();
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      document.body.style.overflow = "";
      opener.current?.focus();
    };
    el.addEventListener("close", onClose);
    return () => {
      document.body.style.overflow = "";
      el.removeEventListener("close", onClose);
    };
  }, []);
  function open(index: number, button: HTMLButtonElement) {
    opener.current = button;
    setSelected(index);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
  }
  function next(step: number) {
    setSelected((i) => (i + step + gallery.length) % gallery.length);
  }
  return (
    <section id="gallery" className="section container reveal">
      <div className="section-heading">
        <div>
          <SectionLabel number="07">BEYOND THE SCREEN</SectionLabel>
          <h2>
            Our team. <span className="muted">Our journey.</span>
          </h2>
        </div>
        <span className="section-note">The people behind CyberGuard.</span>
      </div>
      <div className="gallery-grid">
        {gallery.map((item, i) => (
          <button
            key={item.src}
            className="gallery-item"
            onClick={(e) => open(i, e.currentTarget)}
            aria-label={`Open photo of ${item.title}`}
          >
            <img
              src={item.src}
              alt={item.alt}
              width="400"
              height="400"
              loading="lazy"
            />
            <div className="gallery-overlay">
              <span>
                <small>{item.category}</small>
                {item.title}
              </span>
              <Expand size={18} />
            </div>
          </button>
        ))}
      </div>
      <p className="gallery-note">
        Competition moments, presentations, and project photos will be added as
        our journey continues. <ArrowUpRight size={15} />
      </p>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Full-screen photo viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next(1);
          if (e.key === "ArrowLeft") next(-1);
        }}
      >
        <button
          className="lightbox-close icon-button"
          aria-label="Close photo viewer"
          onClick={close}
        >
          <X />
        </button>
        <div className="lightbox-body">
          <button
            className="icon-button"
            onClick={() => next(-1)}
            aria-label="Previous photo"
          >
            <ArrowLeft />
          </button>
          <figure>
            <img src={gallery[selected]?.src} alt={gallery[selected]?.alt} />
            <figcaption>
              {gallery[selected]?.title}
              <span>
                {selected + 1} / {gallery.length}
              </span>
            </figcaption>
          </figure>
          <button
            className="icon-button"
            onClick={() => next(1)}
            aria-label="Next photo"
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </section>
  );
}
