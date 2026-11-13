"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Stagger, StaggerItem, Reveal, AnimatedLink } from "@/components/motion";

/* ── Types ────────────────────────────────────────────────── */

interface Track {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt: string;
}

interface TopArtist {
  name: string;
  genres: string[];
  image: string | null;
  url: string;
  popularity: number;
}

interface GenreCount {
  genre: string;
  count: number;
}

interface TopTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  url: string;
}

type Vibe = "essential" | "late night" | "background" | "on repeat" | "comfort" | "growing on me";

interface StackAlbum {
  title: string;
  artist: string;
  year: string;
  art: string;
  url: string;
  vibe: Vibe;
  take: string;
}

interface RankedAlbum extends StackAlbum {
  rank: number;
}

/* ── Curated data (hand-written takes) ────────────────────── */

const theStack: RankedAlbum[] = [
  {
    rank: 1,
    title: "Blonde",
    artist: "Frank Ocean",
    year: "2016",
    art: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
    url: "https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf",
    vibe: "essential",
    take: "",
  },
  {
    rank: 2,
    title: "Take Care",
    artist: "Drake",
    year: "2011",
    art: "https://i.scdn.co/image/ab67616d0000b273c7ea04a9b455e3f68ef82550",
    url: "https://open.spotify.com/album/6X1x82kppWZmDzlXXK3y3q",
    vibe: "comfort",
    take: "",
  },
  {
    rank: 3,
    title: "House Of Balloons",
    artist: "The Weeknd",
    year: "2011",
    art: "https://i.scdn.co/image/ab67616d0000b273274b406a7e18acebcf743079",
    url: "https://open.spotify.com/album/7zCODUHkfuRxsUjtuzNqbd",
    vibe: "late night",
    take: "",
  },
  {
    rank: 3,
    title: "Starboy",
    artist: "The Weeknd",
    year: "2016",
    art: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
    url: "https://open.spotify.com/album/2ODvWsOgouMbaA5xf0RkJe",
    vibe: "essential",
    take: "",
  },
  {
    rank: 5,
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    year: "2010",
    art: "https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f",
    url: "https://open.spotify.com/album/20r762YmB5HeofjMCiPMLv",
    vibe: "essential",
    take: "",
  },
  {
    rank: 6,
    title: "Wiped Out!",
    artist: "The Neighbourhood",
    year: "2015",
    art: "https://i.scdn.co/image/ab67616d0000b2735260c62db020e5861a51556d",
    url: "https://open.spotify.com/album/18iFxjZugvKhuNNMbLjZJF",
    vibe: "late night",
    take: "",
  },
  {
    rank: 7,
    title: "Luv Is Rage 2",
    artist: "Lil Uzi Vert",
    year: "2017",
    art: "https://i.scdn.co/image/ab67616d0000b273f23aee9d3be9fcbca1bc6352",
    url: "https://open.spotify.com/album/733e1ZfktLSwj96X5rsMeE",
    vibe: "on repeat",
    take: "",
  },
];

const vibeColors: Record<Vibe, string> = {
  "essential":     "bg-emerald-500/15 text-emerald-400",
  "late night":    "bg-indigo-500/15 text-indigo-400",
  "background":    "bg-slate-500/15 text-slate-400",
  "on repeat":     "bg-rose-500/15 text-rose-400",
  "comfort":       "bg-amber-500/15 text-amber-400",
  "growing on me": "bg-cyan-500/15 text-cyan-400",
};

/* ── Genre → color mapping ────────────────────────────────── */

const genreColorMap: Record<string, string> = {
  "r&b":         "#c084fc",
  "soul":        "#c084fc",
  "neo soul":    "#c084fc",
  "hip hop":     "#f472b6",
  "rap":         "#f472b6",
  "trap":        "#f472b6",
  "alternative": "#60a5fa",
  "rock":        "#60a5fa",
  "art":         "#60a5fa",
  "indie":       "#34d399",
  "folk":        "#fbbf24",
  "acoustic":    "#fbbf24",
  "electronic":  "#38bdf8",
  "pop":         "#fb923c",
  "jazz":        "#a78bfa",
  "classical":   "#94a3b8",
};

function getGenreColor(genre: string): string {
  const lower = genre.toLowerCase();
  for (const [key, color] of Object.entries(genreColorMap)) {
    if (lower.includes(key)) return color;
  }
  return "#64748b";
}

function bucketGenres(genres: GenreCount[]): { label: string; color: string; weight: number }[] {
  const weights: Record<string, number> = {};
  const labels: Record<string, { name: string; count: number }> = {};

  for (const { genre, count } of genres) {
    const color = getGenreColor(genre);
    weights[color] = (weights[color] || 0) + count;

    if (!labels[color] || count > labels[color].count) {
      const titleCased = genre
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      labels[color] = { name: titleCased, count };
    }
  }

  return Object.entries(weights)
    .map(([color, weight]) => ({
      label: labels[color]?.name || color,
      color,
      weight,
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);
}

/* ── Helpers ──────────────────────────────────────────────── */

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Time range labels ────────────────────────────────────── */

type TimeRange = "shortTerm" | "mediumTerm" | "longTerm";

const timeRangeLabels: Record<TimeRange, string> = {
  shortTerm: "Last 4 weeks",
  mediumTerm: "Last 6 months",
  longTerm: "All time",
};

const onRepeatRanges: { key: TimeRange; label: string }[] = [
  { key: "mediumTerm", label: "Last 6 months" },
  { key: "longTerm", label: "All time" },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function SpotifyPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Record<TimeRange, TopArtist[]>>({
    shortTerm: [],
    mediumTerm: [],
    longTerm: [],
  });
  const [topGenres, setTopGenres] = useState<GenreCount[]>([]);
  const [topTracks, setTopTracks] = useState<Record<TimeRange, TopTrack[]>>({
    shortTerm: [],
    mediumTerm: [],
    longTerm: [],
  });
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [artistRange, setArtistRange] = useState<TimeRange>("shortTerm");
  const [trackRange, setTrackRange] = useState<TimeRange>("mediumTerm");

  useEffect(() => {
    async function fetchAll() {
      const [historyRes, topRes] = await Promise.allSettled([
        fetch("/api/spotify-history"),
        fetch("/api/spotify-top"),
      ]);

      if (historyRes.status === "fulfilled" && historyRes.value.ok) {
        const data = await historyRes.value.json();
        setTracks(data.tracks || []);
      }
      setLoading(false);

      if (topRes.status === "fulfilled" && topRes.value.ok) {
        const data = await topRes.value.json();
        setTopArtists(data.topArtists || { shortTerm: [], mediumTerm: [], longTerm: [] });
        setTopGenres(data.topGenres || []);
        setTopTracks(data.topTracks || { shortTerm: [], mediumTerm: [], longTerm: [] });
      }
      setTopLoading(false);
    }
    fetchAll();
  }, []);

  const moodBands = bucketGenres(topGenres);
  const totalWeight = moodBands.reduce((s, m) => s + m.weight, 0) || 1;
  const activeArtists = topArtists[artistRange];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-6 py-24 md:py-32">

        {/* ── Header ─────────────────────────────────────── */}
        <Stagger className="mb-16 text-center">
          <StaggerItem>
            <AnimatedLink href="/" className="text-muted text-xs uppercase tracking-wide mb-8 hover:text-foreground transition-colors">
              ← Back
            </AnimatedLink>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-foreground-strong text-2xl mt-8 mb-2">Listening</h1>
            <p className="text-muted text-sm max-w-sm mx-auto">
              What I reach for, what I return to, and what&apos;s been playing lately.
            </p>
          </StaggerItem>
        </Stagger>

        {/* ── Mood Spectrum (API-driven) ─────────────────── */}
        <Reveal className="mb-20">
          <p className="eyebrow mb-4">Genre DNA</p>
          {topLoading ? (
            <div className="h-2 w-full rounded-full bg-white/5 animate-pulse" />
          ) : moodBands.length > 0 ? (
            <>
              <div className="flex h-2 w-full overflow-hidden rounded-full">
                {moodBands.map((band) => (
                  <div
                    key={band.label}
                    className="h-full transition-all duration-700"
                    style={{
                      backgroundColor: band.color,
                      width: `${(band.weight / totalWeight) * 100}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                {moodBands.map((band) => (
                  <div key={band.label} className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: band.color }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {band.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted">No genre data available yet.</p>
          )}
        </Reveal>

        {/* ── Top Artists ────────────────────────────────── */}
        <Reveal className="mb-20">
          <div className="mb-6 flex items-baseline justify-between">
            <p className="eyebrow">Top artists</p>
            <div className="flex gap-1">
              {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setArtistRange(range)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    artistRange === range
                      ? "bg-white/10 text-foreground-strong"
                      : "text-muted hover:text-foreground-strong"
                  }`}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </div>
          </div>

          {topLoading ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : activeArtists.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {activeArtists.slice(0, 10).map((artist, i) => (
                <a
                  key={artist.name}
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/10">
                    {artist.image && (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-1.5 top-1.5 font-mono text-[9px] text-white/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-strong truncate group-hover:text-foreground-strong transition-colors">
                    {artist.name}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No artist data available yet.</p>
          )}
        </Reveal>

        {/* ── On Repeat (top tracks, API) ──────────────────── */}
        <Reveal className="mb-20">
          <div className="mb-6 flex items-baseline justify-between">
            <p className="eyebrow">On repeat</p>
            <div className="flex gap-1">
              {onRepeatRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTrackRange(range.key)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    trackRange === range.key
                      ? "bg-white/10 text-foreground-strong"
                      : "text-muted hover:text-foreground-strong"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {topLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2.5">
                  <div className="w-5 h-3 rounded bg-white/5 animate-pulse" />
                  <div className="w-10 h-10 rounded bg-white/5 animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
                    <div className="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : topTracks[trackRange].length > 0 ? (
            <div className="space-y-1">
              {topTracks[trackRange].map((track, i) => (
                <a
                  key={track.title + track.artist + trackRange}
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-2.5 -mx-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="w-5 text-right font-mono text-[10px] text-muted/40 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="relative w-10 h-10 flex-shrink-0 bg-muted/20 rounded overflow-hidden">
                    {track.albumImageUrl && (
                      <Image
                        src={track.albumImageUrl}
                        alt={track.album}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm truncate group-hover:text-foreground-strong transition-colors">
                      {track.title}
                    </p>
                    <p className="text-muted text-xs truncate">
                      {track.artist}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No track data available yet.</p>
          )}
        </Reveal>

        {/* ── The Stack (carousel) ────────────────────────── */}
        <Reveal className="mb-20">
          <div className="mb-6">
            <p className="eyebrow">The stack</p>
          </div>
        </Reveal>

        {/* Full-bleed carousel — breaks out of max-w container */}
        <div className="mb-20 -mx-6 overflow-hidden group/carousel">
          <div
            className="flex gap-5 w-max"
            style={{
              animation: "carousel-scroll 30s linear infinite",
              animationPlayState: "running",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
          >
            {/* Duplicate the list for seamless loop */}
            {[...theStack, ...theStack].map((album, i) => (
              <a
                key={album.title + "-" + i}
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-44 sm:w-52"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/10">
                  <Image
                    src={album.art}
                    alt={`${album.title} by ${album.artist}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay — ready for future thoughts/rankings */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className={`self-start rounded-full px-2 py-0.5 mb-1.5 font-mono text-[9px] uppercase tracking-wider ${vibeColors[album.vibe]}`}>
                      {album.vibe}
                    </span>
                    {album.take && (
                      <p className="font-serif text-xs italic leading-snug text-white/80 line-clamp-3">
                        &ldquo;{album.take}&rdquo;
                      </p>
                    )}
                  </div>
                  {/* Rank badge */}
                  <span className="absolute left-2 top-2 font-mono text-[10px] font-bold text-white/60 drop-shadow-sm">
                    {String(album.rank).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-2.5 min-w-0 px-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[10px] text-foreground-strong flex-shrink-0">
                      {theStack.filter((a) => a.rank === album.rank).length > 1
                        ? `t${album.rank}`
                        : `#${album.rank}`}
                    </span>
                    <h3 className="text-foreground-strong text-sm font-medium truncate">
                      {album.title}
                    </h3>
                  </div>
                  <p className="text-muted text-xs truncate pl-[calc(0.625rem+0.375rem)]">
                    {album.artist}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Recent Plays (live API) ────────────────────── */}
        <Reveal>
          <div className="mb-6 flex items-baseline justify-between">
            <p className="eyebrow">Recently played</p>
            {!loading && (
              <p className="text-xs text-muted">{tracks.length} tracks</p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-muted border-t-foreground rounded-full animate-spin" />
            </div>
          ) : (
            <Stagger className="space-y-1">
              {tracks.map((track, i) => (
                <StaggerItem key={track.playedAt + i}>
                  <a
                    href={track.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group p-2.5 -mx-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 bg-muted/20 rounded overflow-hidden">
                      {track.albumImageUrl && (
                        <Image
                          src={track.albumImageUrl}
                          alt={track.album}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate group-hover:text-foreground-strong transition-colors">
                        {track.title}
                      </p>
                      <p className="text-muted text-xs truncate">
                        {track.artist}
                      </p>
                    </div>
                    <div className="text-muted/40 font-mono text-[10px] whitespace-nowrap">
                      {formatTimeAgo(track.playedAt)}
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Reveal>

      </main>
    </div>
  );
}
