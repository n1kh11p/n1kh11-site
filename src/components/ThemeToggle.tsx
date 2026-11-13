"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem("theme");
      } catch {
        return null;
      }
    })();
    const next: Theme = stored === "dark" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    setReady(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      if (detail === "light" || detail === "dark") setTheme(detail);
    };
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return { theme, toggle, ready };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle, ready } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light" : "Dark"}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-strong text-muted transition-colors hover:border-muted hover:text-foreground-strong ${className}`}
    >
      {!ready ? (
        <span className="h-3 w-3 rounded-full bg-muted/40" />
      ) : theme === "dark" ? (
        /* sun */
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.2 3.2l.85.85M12 12l.85.85M12.85 3.2l-.85.85M4 12l-.85.85"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        /* moon */
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13.2 9.4A5.6 5.6 0 0 1 6.6 2.8 5.7 5.7 0 1 0 13.2 9.4Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
