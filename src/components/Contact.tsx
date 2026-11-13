"use client";

import { Reveal } from "./motion";

const channels = [
  {
    label: "Email",
    value: "nikhil.paruchuri@gmail.com",
    href: "mailto:nikhil.paruchuri@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "in/nikhil-paruchuri",
    href: "https://www.linkedin.com/in/nikhil-paruchuri/",
    external: true,
  },
];

export function Contact() {
  return (
    <Reveal id="contact" className="scroll-mt-28 mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-border-strong surface p-8 md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(196,140,90,0.2),transparent_70%)] blur-2xl dark:opacity-30" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(140,120,95,0.18),transparent_70%)] blur-2xl dark:opacity-20" />
        <p className="relative eyebrow mb-4">Contact</p>
        <h2 className="relative font-serif text-3xl italic leading-tight text-foreground-strong md:text-4xl">
          Let&apos;s talk.
        </h2>
        <p className="relative mt-2 max-w-prose text-muted-strong">
          Recruiting, collaborating, or just want to debate music takes? My inbox is open.
        </p>

        <div className="relative mt-6 grid grid-cols-1 gap-2 md:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:border-muted dark:bg-background/40"
            >
              <div className="min-w-0">
                <p className="eyebrow">{c.label}</p>
                <p className="mt-0.5 truncate text-sm text-foreground-strong">
                  {c.value}
                </p>
              </div>
              <span className="text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground-strong">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
