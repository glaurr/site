"use client"; // this needs a click handler and localStorage.

import type { Dictionary } from "@/lib/dictionaries";

/*
  It writes data-theme on <html> and remembers the choice. Without a stored
  choice there is no attribute at all, so the CSS falls back to the operating
  system preference — which is the behaviour most people expect on a first
  visit.
*/
export function ThemeToggle({ labels }: { labels: Dictionary["theme"] }) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";

    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch { }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={labels.toggle}
      className="label cursor-pointer hover:text-accent"
    >
      { }
      <span data-show-in="light">{labels.dark}</span>
      <span data-show-in="dark">{labels.light}</span>
    </button>
  );
}
