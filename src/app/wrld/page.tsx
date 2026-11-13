"use client";

import { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle, useTheme } from "@/components/ThemeToggle";

/* ── Types ────────────────────────────────────────────────── */

type Significance = "home" | "formative" | "visited";

interface Moment {
  image: string;
  caption?: string;
  date?: string;
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  significance: Significance;
  tagline: string;
  moments: Moment[];
}

/* ── Data ─────────────────────────────────────────────────── */

const locations: Location[] = [
  // ── Home ──
  {
    name: "Columbus",
    lat: 39.9612,
    lng: -82.9988,
    significance: "home",
    tagline: "My hometown.",
    moments: [
      { image: "/wrld/columbus-01.jpg", caption: "Three-headed goat", date: "2010"},
      { image: "/wrld/columbus-02.jpg", caption: "Indian Run Elementary", date: "2011" },
      { image: "/wrld/columbus-03.jpg", caption: "og crew", date: "2017" },
      { image: "/wrld/columbus-04.jpg", caption: "AP CSP the origins", date: "2022" },
      { image: "/wrld/columbus-05.jpg", caption: "LibBrownBoys Grad", date: "2023" },
      { image: "/wrld/columbus-06.jpg", caption: "Horns Down", date: "2025"},
    ],
  },
  {
    name: "Gudivada",
    lat: 16.4356,
    lng: 80.9928,
    significance: "home",
    tagline: "My Mom's hometown",
    moments: [
      { image: "/wrld/gudivada-01.jpg", caption: "Family Ties", date: "2011" },
      { image: "/wrld/gudivada-02.jpg", caption: "The city", date: "2023" },
      { image: "/wrld/gudivada-03.jpg", caption: "Thatha's house", date: "2024" },
    ],
  },
  {
    name: "Chitturpu",
    lat: 16.35,
    lng: 80.45,
    significance: "home",
    tagline: "My Dad's hometown",
    moments: [
      { image: "/wrld/chitturpu-01.jpg", caption: "Family", date: "2023" },
      { image: "/wrld/chitturpu-02.jpg", caption: "Three-headed goat pt2", date: "2024" },
    ],
  },

  // ── Formative ──
  {
    name: "College Park",
    lat: 38.9897,
    lng: -76.9378,
    significance: "formative",
    tagline: "Where I grew up the second time.",
    moments: [
      { image: "/wrld/collegepark-01.jpg", caption: "Iribe Center", date: "2023 – 2027" },
      { image: "/wrld/collegepark-02.jpg", caption: "Cognitive Incline", date: "2026" },
      { image: "/wrld/collegepark-03.jpg", caption: "FIRE", date: "2024" },
      { image: "/wrld/collegepark-04.jpg", caption: "Roomies", date: "2024" },
      { image: "/wrld/collegepark-05.jpg", caption: "Fugazi", date: "2025" },
    ],
  },
  {
    name: "Newport Beach",
    lat: 33.6189,
    lng: -117.9298,
    significance: "formative",
    tagline: "OD SoCal",
    moments: [
      { image: "/wrld/newport-01.jpg", caption: "Chipotle HQ", date: "Summer 2024" },
      { image: "/wrld/newport-02.jpg", caption: "Laguna Beach", date: "Summer 2024" },
      { image: "/wrld/newport-03.jpg", caption: "The Office", date: "Summer 2024" },
      { image: "/wrld/newport-04.jpg", caption: "Team dinner", date: "Summer 2024" },
    ],
  },
  {
    name: "McLean",
    lat: 38.9339,
    lng: -77.1773,
    significance: "formative",
    tagline: "What's in yo wallet",
    moments: [
      { image: "/wrld/mclean-01.jpg", caption: "Teip squad", date: "Summer 2025" },
      { image: "/wrld/mclean-02.jpg", caption: "hermano", date: "Summer 2025" },
      { image: "/wrld/mclean-03.jpg", caption: "Me and my hb Rich", date: "Summer 2025" },
      { image: '/wrld/mclean-04.jpg', caption: 'Weekend Concert', date: 'Summer 2025' },
    ],
  },
  {
    name: "Mountain View",
    lat: 37.3861,
    lng: -122.0839,
    significance: "formative",
    tagline: "LinkedIn summer.",
    moments: [
      { image: "/wrld/mountainview-01.jpg", caption: "LinkedIn HQ", date: "Summer 2026" },
      { image: "/wrld/mountainview-02.jpg", caption: "oak & umber", date: "Summer 2026" },
      { image: "/wrld/mountainview-03.jpg", caption: "jaxxx", date: "Summer 2026" },
      { image: "/wrld/mountainview-04.jpg", caption: "donnyyy", date: "Summer 2026" },
      { image: "/wrld/mountainview-05.jpg", caption: "hometown homies", date: "Summer 2026" },
    ],
  },
  {
    name: "Redmond",
    lat: 47.674,
    lng: -122.1215,
    significance: "formative",
    tagline: "Pacific Northwest energy.",
    moments: [],
  },

  // ── Visited ──
  {
    name: "New York City",
    lat: 40.7128,
    lng: -74.006,
    significance: "visited",
    tagline: "The city that never sleeps, so I guess I'm never slept on.",
    moments: [
      { image: "/wrld/nyc-01.jpg", caption: "Times Square", date: "May 2025" },
      { image: "/wrld/nyc-02.jpg", caption: "FiDi", date: "Oct 2025" },
      { image: "/wrld/nyc-03.jpg", caption: "Central Park", date: "May 2025" },
      { image: "/wrld/nyc-04.jpg", caption: "Brooklyn Bridge", date: "Oct 2025" },
    ],
  },
  {
    name: "Austin",
    lat: 30.2672,
    lng: -97.7431,
    significance: "visited",
    tagline: "T5 Underratted.",
    moments: [
      { image: "/wrld/austin-01.jpg", caption: "Downtown Austin", date: 'July 2025' },
      { image: "/wrld/austin-02.jpg", caption: "Lady Bird Lake", date: 'July 2025' },
      { image: "/wrld/austin-03.jpg", caption: "Three man", date: 'July 2025' },
      { image: "/wrld/austin-04.jpg", caption: "6th street", date: 'July 2025' },
    ],
  },
  {
    name: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    significance: "visited",
    tagline: "Look at Curry man so inspirational.",
    moments: [
      { image: "/wrld/sf-01.jpg", caption: "Treasure Island", date: "Jan 2026" },
      { image: "/wrld/sf-02.jpg", caption: "Port of SF", date: "Jan 2026" },
      { image: "/wrld/sf-03.jpg", caption: "Gangy", date: "Jan 2026" },
      { image: "/wrld/sf-04.jpg", caption: "futureforce", date: "July 2025" },
      { image: "/wrld/sf-05.jpg", caption: "Concrete jungle", date: "July 2025" },
    ],
  },
  {
    name: "Los Angeles",
    lat: 34.0522,
    lng: -118.2437,
    significance: "visited",
    tagline: "West coast detour.",
    moments: [
      { image: "/wrld/la-01.jpg", caption: "The Hills", date: "Summer 2026" },
      { image: "/wrld/la-02.jpg", caption: "back on rodeo", date: "Summer 2026" },
      { image: "/wrld/la-03.jpg", caption: "holbox", date: "Summer 2026" },
    ],
  },
  {
    name: "Mexico City",
    lat: 19.4326,
    lng: -99.1332,
    significance: "visited",
    tagline: "Spreak26.",
    moments: [
      { image: "/wrld/cdmx-01.jpg", caption: "Roma Norte"},
      { image: "/wrld/cdmx-02.jpg", caption: "Polanco" },
      { image: "/wrld/cdmx-03.jpg", caption: "City view" },
      { image: "/wrld/cdmx-04.jpg", caption: "Museo Soumaya" },
      { image: "/wrld/cdmx-05.jpg", caption: "Teotihuacán" },
    ],
  },
  {
    name: "Cancun",
    lat: 21.1619,
    lng: -86.8515,
    significance: "visited",
    tagline: "Spreak26.",
    moments: [
      { image: "/wrld/cancun-01.jpg", caption: "Isla Blanca" },
      { image: "/wrld/cancun-02.jpg", caption: "Cognitive Incline pt2" },
      { image: "/wrld/cancun-03.jpg", caption: "Spark scenery" },
      { image: "/wrld/cancun-04.jpg", caption: "Spiffy" },
      { image: "/wrld/cancun-05.jpg", caption: "Beachside" },
    ],
  },
  {
    name: "Siesta Key",
    lat: 27.2669,
    lng: -82.5462,
    significance: "visited",
    tagline: "Senior Trip 23",
    moments: [
      { image: "/wrld/siestakey-01.jpg", caption: "Siesta Beach" },
      { image: "/wrld/siestakey-02.jpg", caption: "Turtle Beach" },
      { image: "/wrld/siestakey-03.jpg", caption: "Night lights" },
    ],
  },
];

/* ── Marker styling by significance ───────────────────────── */

const sigConfig: Record<Significance, { color: string; size: number; ring: number }> = {
  home:      { color: "#059669", size: 0.6,  ring: 3.5 },
  formative: { color: "#0e7490", size: 0.45, ring: 2.5 },
  visited:   { color: "#475569", size: 0.3,  ring: 1.8 },
};

/* ── Globe (dynamic import — SSR disabled) ────────────────── */

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

/* ── Page ─────────────────────────────────────────────────── */

function WrldPageInner() {
  const searchParams = useSearchParams();
  const noRings = searchParams.get("noRings") === "1";
  const noAtmo = searchParams.get("noAtmo") === "1";
  const noImages = searchParams.get("noImages") === "1";

  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const selectedAccent = isDark ? "#ffffff" : "#12141a";

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);

  /* ── Initial camera setup ─────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const init = () => {
      if (cancelled || !globeRef.current) return false;
      const globe = globeRef.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
      globe.controls().enableZoom = true;
      globe.controls().enablePan = false;
      globe.pointOfView({ lat: 35, lng: -95, altitude: 2.2 }, 1000);

      return true;
    };

    // Poll until the globe ref is available (WebGL init can be slow)
    if (!init()) {
      const interval = setInterval(() => {
        if (init()) clearInterval(interval);
      }, 100);
      return () => { cancelled = true; clearInterval(interval); };
    }

    return () => { cancelled = true; };
  }, [mounted]);

  /* ── Fly to location ──────────────────────────────────── */
  const flyTo = useCallback((loc: Location) => {
    setLightboxIdx(null);
    setSelectedLoc(loc);
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = false;
    globeRef.current.pointOfView(
      { lat: loc.lat, lng: loc.lng, altitude: 1.2 },
      1000
    );
  }, []);

  /* ── Close sheet ──────────────────────────────────────── */
  const handleClose = useCallback(() => {
    setLightboxIdx(null);
    setSelectedLoc(null);
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    globeRef.current.pointOfView({ lat: 35, lng: -95, altitude: 2.2 }, 1000);
  }, []);

  /* ── Globe marker click ───────────────────────────────── */
  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as { lat: number; lng: number };
      const loc = locations.find((l) => l.lat === p.lat && l.lng === p.lng);
      if (loc) flyTo(loc);
    },
    [flyTo]
  );

  /* ── Pause rotation on marker hover ──────────────────── */
  const handlePointHover = useCallback(
    (point: object | null) => {
      if (!globeRef.current || selectedLoc) return;
      globeRef.current.controls().autoRotate = !point;
    },
    [selectedLoc]
  );

  /* ── Globe data ───────────────────────────────────────── */
  const pointsData = useMemo(() =>
    locations.map((loc) => ({
      lat: loc.lat,
      lng: loc.lng,
      size: sigConfig[loc.significance].size,
      color: selectedLoc === loc
        ? selectedAccent
        : sigConfig[loc.significance].color,
      label: loc.name,
    })),
    [selectedLoc, selectedAccent]
  );

  const ringsData = useMemo(() =>
    locations.map((loc) => ({
      lat: loc.lat,
      lng: loc.lng,
      maxR: selectedLoc === loc ? 5 : sigConfig[loc.significance].ring,
      propagationSpeed: loc.significance === "home" ? 2 : 1.5,
      repeatPeriod: selectedLoc === loc ? 600 : (loc.significance === "home" ? 800 : 1200),
      color: selectedLoc === loc ? selectedAccent : sigConfig[loc.significance].color,
    })),
    [selectedLoc, selectedAccent]
  );

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Soft edge scrims so UI stays readable over dark oceans (no backdrop-blur — crashes over WebGL) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-background via-background/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-background via-background/75 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-40 bg-gradient-to-r from-background/80 via-background/40 to-transparent md:w-56"
      />

      {/* Back link + theme — always visible */}
      <div className="absolute left-6 top-6 z-30 flex items-center gap-2">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-background/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground-strong transition-colors hover:border-muted"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back
        </Link>
      </div>
      <div className="absolute right-6 top-6 z-30">
        <ThemeToggle className="bg-background/90" />
      </div>

      {/* Title overlay — fades out when sheet is open */}
      <AnimatePresence>
        {!selectedLoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-6 bottom-32 z-30 md:left-10 md:bottom-36 pointer-events-none"
          >
            <div className="rounded-2xl border border-border-strong/60 bg-background/90 px-4 py-3 md:px-5 md:py-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-strong">
                Explore
              </p>
              <h1
                className="mt-1 font-display text-4xl text-foreground-strong md:text-5xl"
                style={{
                  textShadow: isDark
                    ? "0 1px 2px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.35)"
                    : "0 1px 0 rgba(255,248,235,0.5)",
                }}
              >
                Nikhil&apos;s Wrld
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Globe */}
      {mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe
            ref={globeRef}
            globeImageUrl={
              isDark
                ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
                : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            }
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor={noAtmo ? "rgba(0,0,0,0)" : isDark ? "#334155" : "#9eb6d4"}
            atmosphereAltitude={noAtmo ? 0 : isDark ? 0.2 : 0.18}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.01}
            pointRadius="size"
            pointsMerge={false}
            onPointClick={handlePointClick}
            onPointHover={handlePointHover}
            pointLabel="label"
            ringsData={noRings ? [] : ringsData}
            ringLat="lat"
            ringLng="lng"
            ringMaxRadius="maxR"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"
            ringColor="color"
            width={typeof window !== "undefined" ? window.innerWidth : 1200}
            height={typeof window !== "undefined" ? window.innerHeight : 800}
          />
        </div>
      )}

      {/* ── Location chips — always visible at bottom ─────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {locations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => selectedLoc === loc ? handleClose() : flyTo(loc)}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                selectedLoc === loc
                  ? "border-foreground-strong/40 bg-background text-foreground-strong shadow-sm"
                  : "border-border-strong bg-background/90 text-muted-strong hover:border-foreground-strong/30 hover:text-foreground-strong"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors"
                style={{
                  backgroundColor: selectedLoc === loc
                    ? selectedAccent
                    : sigConfig[loc.significance].color,
                }}
              />
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom sheet ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedLoc && (
          <motion.div
            key={selectedLoc.name}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border-strong bg-background/95 backdrop-blur-xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-border-strong" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: sigConfig[selectedLoc.significance].color }}
                  />
                  {selectedLoc.significance}
                </p>
                <h2 className="mt-1 font-display text-2xl text-foreground-strong md:text-3xl">
                  {selectedLoc.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-strong">{selectedLoc.tagline}</p>
              </div>
              <button
                onClick={handleClose}
                className="mt-1 rounded-full p-2 text-muted transition-colors hover:bg-foreground-strong/5 hover:text-foreground-strong"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Photo gallery — horizontal scroll */}
            {selectedLoc.moments.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="pb-6"
              >
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 snap-x snap-mandatory scrollbar-none">
                  {selectedLoc.moments.map((moment, i) => (
                    <button
                      key={i}
                      className="group relative flex-shrink-0 snap-start overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground-strong/20"
                      style={{ width: "min(320px, 75vw)", height: "240px" }}
                      onClick={() => setLightboxIdx(i)}
                    >
                      <Image
                        src={moment.image}
                        alt={moment.caption || ""}
                        width={640}
                        height={480}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
                        {moment.caption && (
                          <p className="text-xs font-medium text-white/90">
                            {moment.caption}
                          </p>
                        )}
                        {moment.date && (
                          <p className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                            {moment.date}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {selectedLoc.moments.length === 0 && (
              <div className="px-6 pb-6">
                <p className="text-sm text-muted">No photos yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLoc && lightboxIdx !== null && (() => {
          const photos = selectedLoc.moments;
          if (lightboxIdx < 0 || lightboxIdx >= photos.length) return null;
          const current = photos[lightboxIdx];
          const hasPrev = lightboxIdx > 0;
          const hasNext = lightboxIdx < photos.length - 1;

          return (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={() => setLightboxIdx(null)}
            >
              {/* Close */}
              <button
                className="absolute top-5 right-5 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                onClick={() => setLightboxIdx(null)}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>

              {/* Counter */}
              <div className="absolute top-5 left-5 z-10 font-mono text-xs text-white/40">
                {lightboxIdx + 1} / {photos.length}
              </div>

              {/* Prev */}
              {hasPrev && (
                <button
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx(lightboxIdx - 1);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 3L5 8l5 5" />
                  </svg>
                </button>
              )}

              {/* Next */}
              {hasNext && (
                <button
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx(lightboxIdx + 1);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </button>
              )}

              {/* Image */}
              <motion.div
                key={lightboxIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[85vh] max-w-[92vw] md:max-w-[80vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={current.image}
                  alt={current.caption || ""}
                  width={1600}
                  height={1200}
                  className="max-h-[85vh] w-auto rounded-lg object-contain"
                  priority
                />
                {/* Caption bar */}
                {(current.caption || current.date) && (
                  <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
                    <div className="flex items-center gap-2">
                      {current.caption && (
                        <span className="text-sm font-medium text-white/90">
                          {current.caption}
                        </span>
                      )}
                      {current.caption && current.date && (
                        <span className="text-white/30">&middot;</span>
                      )}
                      {current.date && (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                          {current.date}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export default function WrldPage() {
  return (
    <Suspense>
      <WrldPageInner />
    </Suspense>
  );
}
