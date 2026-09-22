"use client";
import { useEffect } from "react";
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations: Animation[] = [];
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animations.push(
            entry.target.animate(
              [
                { opacity: 0.25, transform: "translateY(18px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 650, easing: "ease-out" },
            ),
          );
          entry.target
            .querySelectorAll<HTMLElement>("[data-count]")
            .forEach((counter) => {
              const target = Number(counter.dataset.count);
              const text = counter.firstChild;
              if (!text) return;
              text.textContent = "0";
              for (let n = 1; n <= target; n++)
                timers.push(
                  window.setTimeout(() => {
                    text.textContent = String(n);
                  }, n * 160),
                );
            });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);
  return null;
}
