"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion";

type Experience = {
  period: string;
  role: string;
  company: string;
  note: string;
  logo: string;
  /** Optional multiplier to compensate for brand PNGs with heavy internal padding. */
  logoScale?: number;
  bullets?: string[];
  upcoming?: boolean;
  location?: string;
};

const experience: Experience[] = [
  {
    period: "Aug 2026 – Nov 2026",
    role: "Software Engineer Intern",
    company: "Microsoft",
    location: "Redmond, WA",
    note: "Building tooling for Microsoft Teams Researchers to manage Risk Model False Positives.",
    logo: "/microsoft.png",
    logoScale: 1.2,
  },
  {
    period: "May 2026 – Aug 2026",
    role: "Software Engineer Intern",
    company: "LinkedIn",
    location: "Sunnyvale, CA",
    note: "Built LLM pipelines to create and refine engineering metrics, turning developer activity into actionable insights for LinkedIn engineering teams.",
    logo: "/linkedin.png",
    logoScale: 1.7,
    bullets: [
      "Created LinkedIn's first code review quality metric, identifying correlations with PR failures and production incidents.",
      "Refined LinkedIn's post-merge failure rate metric and built an LLM pipeline to classify failures as infrastructure- vs developer-caused.",
    ],
  },
  {
    period: "June 2025 – Aug 2025",
    role: "Software Engineer Intern",
    company: "Capital One",
    location: "McLean, VA",
    note: "Full-stack product engineering on Empath, Capital One's customer agent platform.",
    logo: "/CapitalOne.png",
    bullets: [
      "Shipped features for small business customers to increase spend and digital enrollment.",
      "Worked across the stack — Vue.js / TypeScript on the front, Express services on the back.",
    ],
  },
  {
    period: "June 2024 – Aug 2024",
    role: "Software Engineer Intern",
    company: "Chipotle",
    location: "Newport Beach, CA",
    note: "Product engineering on Chipotle.com — full-stack + infra.",
    logo: "/chipotle.png",
    bullets: [
      "Built features on the ordering platform serving millions of weekly orders.",
      "Worked on everything from automated refund engines, to UI polish, and deployment pipelines.",
    ],
  },
  {
    period: "Jan 2024 – Dec 2024",
    role: "Student Researcher",
    company: "University of Maryland",
    location: "College Park, MD",
    note: "Distributed Earth-system simulations on a HPC cluster Derecho.",
    logo: "/umd.png",
    bullets: [
      "Built and ran climate-model workflows across a multi-node HPC cluster",
      "Analyzed the effects of climate change stemming from the Atlantic Meridional Overturning Circulation.",
    ],
  },
];

type Project = {
  name: string;
  tagline: string;
  stack: string[];
  href?: string;
  repo?: string;
  status?: "Live" | "WIP" | "Archived";
};

const projects: Project[] = [
  {
    name: "Nimbus",
    tagline: "An AI platform built for the way educators actually teach.",
    stack: ["Next.js", "TypeScript", "LLMs", "Postgres"],
    status: "WIP",
  },
  {
    name: "Blokt",
    tagline: "AI powered construction management platform for project managers",
    stack: ["Typescript", "Next.js", "Supabase"],
    status: "Live",
  },
  {
    name: "EzSplit",
    tagline: "Splitting the bill with your friends, minus the group-chat math.",
    stack: ["React Native", "Node", "Expo"],
    status: "Live",
  },
  {
    name: "Rentli",
    tagline: "A peer-to-peer rental marketplace for the stuff you own but rarely use.",
    stack: ["Next.js", "Postgres", "Stripe"],
    status: "WIP",
  },
];

const picks = [
  { label: "Python", kind: "lang" },
  { label: "Go", kind: "lang" },
  { label: "Rust", kind: "lang" },
  { label: "TypeScript", kind: "lang" },
  { label: "Kubernetes", kind: "infra" },
  { label: "Distributed Systems", kind: "infra" },
  { label: "LA Lakers", kind: "life" },
  { label: "Lebron James", kind: "life" },
  { label: "Drake", kind: "music" },
  { label: "Frank Ocean", kind: "music" },
  { label: "Gunna", kind: "music" },
  { label: "JSN", kind: "life" },
  { label: "Robert Frost", kind: "verse" },
  { label: "A. H. Jerriod Avant", kind: "verse" },
];

function LogoNode({
  src,
  alt,
  scale,
  pulse,
}: {
  src: string;
  alt: string;
  scale?: number;
  pulse?: boolean;
}) {
  return (
    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-border-strong surface transition-colors group-hover:border-muted md:h-12 md:w-12">
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        style={scale ? { transform: `scale(${scale})` } : undefined}
        className="h-full w-full object-contain"
      />
      {pulse && (
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: Project["status"] }) {
  if (!status) return null;
  const color =
    status === "Live"
      ? "bg-emerald-400"
      : status === "WIP"
      ? "bg-amber-400"
      : "bg-muted";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong surface px-2 py-0.5 font-mono text-[10px] tracking-wide text-muted-strong">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {status}
    </span>
  );
}

export function Work() {
  return (
    <div className="space-y-24">
      {/* ABOUT */}
      <Reveal id="about" className="scroll-mt-28">
        <p className="eyebrow mb-5">About</p>
        <div className="space-y-4 text-foreground-strong">
          <p className="font-serif text-2xl italic leading-snug text-foreground md:text-3xl">
            Hi, I&apos;m Nikhil!
          </p>
          <p className="text-muted-strong leading-relaxed">
            I&apos;m a junior studying computer science at the University of
            Maryland interested in scalable systems, backend infra, and parallelized hpc. Outside
            of computer science, I&apos;m an avid fan of basketball, RnB/hiphop, running, and
            poetry.
          </p>
        </div>
      </Reveal>

      {/* BEYOND CODE */}
      <section id="writing" className="scroll-mt-28">
        <Reveal>
          <p className="eyebrow mb-5">Beyond code</p>
          <p className="max-w-prose text-muted-strong">
            Some of my favs — languages, teams, athletes, writers, artists.
          </p>
        </Reveal>

        <Stagger className="mt-6 flex flex-wrap gap-2">
          {picks.map((p) => (
            <StaggerItem key={p.label}>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  p.kind === "verse"
                    ? "border-border-strong bg-background-elev/40 font-serif italic text-foreground"
                    : "border-border bg-background-elev/40 text-muted-strong hover:border-muted hover:text-foreground"
                }`}
              >
                <span className="h-1 w-1 rounded-full bg-muted" />
                {p.label}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AnimatedCard
              href="/spotify"
              eyebrow="Listening"
              title="My Music"
              subtitle="My taste and listening habits."
            />
            <AnimatedCard
              href="/writing"
              eyebrow="Writing"
              title="Poems & prose"
              subtitle="A quieter room on the site. Take your shoes off."
              serif
            />
          </div>
          <div className="mt-3">
            <AnimatedCard
              href="/wrld"
              eyebrow="Explore"
              title="Nikhil's Wrld"
              subtitle="An interactive globe of the places that shaped me."
              display
            />
          </div>
        </Reveal>
      </section>

      {/* EXPERIENCE — TIMELINE */}
      <section id="work" className="scroll-mt-28">
        <Reveal>
          <div className="mb-8 flex items-baseline justify-between">
            <p className="eyebrow">Experience</p>
            <p className="text-xs text-muted">{experience.length} roles</p>
          </div>
        </Reveal>

        <Stagger className="relative">
          {/* vertical rule */}
          <span
            aria-hidden
            className="absolute left-[21px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border-strong to-transparent md:left-[23px]"
          />
          <ul className="space-y-8">
            {experience.map((exp) => (
              <StaggerItem key={exp.company + exp.period}>
                <li className="group relative grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[48px_1fr] md:gap-5">
                  <div className="relative flex justify-center pt-1">
                    <LogoNode
                      src={exp.logo}
                      alt={exp.company}
                      scale={exp.logoScale}
                      pulse={exp.upcoming}
                    />
                  </div>

                  <div className="min-w-0 pb-2">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="text-foreground-strong">
                        {exp.company}{" "}
                        <span className="text-muted-strong">· {exp.role}</span>
                      </h3>
                      {exp.upcoming && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-px font-mono text-[10px] text-emerald-300">
                          next
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {exp.period}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-muted-strong leading-relaxed">
                      {exp.note}
                    </p>
                    {exp.bullets && (
                      <ul className="mt-2 space-y-1 text-sm text-muted">
                        {exp.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-[9px] h-px w-3 flex-shrink-0 bg-border-strong" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              </StaggerItem>
            ))}
          </ul>
        </Stagger>
      </section>

      {/* EDUCATION */}
      <Reveal id="education" className="scroll-mt-28">
        <p className="eyebrow mb-5">Education</p>
        <div className="group flex gap-4 md:gap-5">
          <LogoNode src="/umd.png" alt="University of Maryland" />
          <div>
            <h3 className="text-foreground-strong">University of Maryland</h3>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
              Aug 2023 – Present · College Park, MD
            </p>
            <p className="mt-2 text-sm text-muted-strong">
              B.S. Computer Science, Minor in Creative Writing.
            </p>
            <p className="mt-3 text-xs text-muted">Classes that stuck with me</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[
                "Parallel Computing",
                "Computer Systems",
                "Advanced Poetry Workshop",
                "Foundations of Programming Languages",
                "Network Security",
                "Great Thinkers on Public Policy",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-background-elev/40 px-2.5 py-0.5 text-xs text-muted-strong"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* PROJECTS */}
      <section id="projects" className="scroll-mt-28">
        <Reveal>
          <p className="eyebrow mb-5">Selected projects</p>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {projects.map((p) => {
            const Inner = (
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border-strong surface p-5 transition-colors hover:border-muted">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(196,140,90,0.16),transparent_70%)] blur-2xl transition-opacity group-hover:opacity-80 dark:bg-foreground-strong/[0.04]" />
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-serif text-xl italic text-foreground-strong">
                      {p.name}
                    </h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-muted-strong leading-relaxed">{p.tagline}</p>
                </div>
                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {(p.href || p.repo) && (
                  <div className="relative mt-4 flex items-center gap-3 text-xs text-muted">
                    {p.href && <span className="underline-offset-4 group-hover:underline">visit ↗</span>}
                    {p.repo && <span className="underline-offset-4 group-hover:underline">source ↗</span>}
                  </div>
                )}
              </div>
            );
            return (
              <StaggerItem key={p.name}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {Inner}
                  </a>
                ) : (
                  Inner
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

    </div>
  );
}

function AnimatedCard({
  href,
  eyebrow,
  title,
  subtitle,
  serif,
  display,
}: {
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  serif?: boolean;
  display?: boolean;
}) {
  return (
    <a
      href={href}
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border-strong surface p-5 transition-colors hover:border-muted"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(196,140,90,0.1)] via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-foreground-strong/[0.04]" />
      <div className="relative">
        <p className="eyebrow mb-1">{eyebrow}</p>
        <p
          className={`text-foreground-strong ${
            display ? "font-display text-lg" : serif ? "font-serif text-lg italic" : "text-base"
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
      </div>
      <span className="relative text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground-strong">
        ↗
      </span>
    </a>
  );
}

