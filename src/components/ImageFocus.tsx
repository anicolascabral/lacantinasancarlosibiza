"use client";

import { useEffect } from "react";

// Toggles `.is-colored` on every `.img-duo` image while it sits in the central
// band of the viewport — i.e. colour only while it's "in front" of the viewer,
// reverting to black & white as it scrolls away.
export default function ImageFocus() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".img-duo"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("is-colored", e.isIntersecting);
        });
      },
      // Shrink the root to the central ~46% of the viewport so an image only
      // "lights up" once it's roughly centred on screen.
      { root: null, rootMargin: "-27% 0px -27% 0px", threshold: 0.01 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
