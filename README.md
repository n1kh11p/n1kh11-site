# n1kh11.com

Personal site for [Nikhil Paruchuri](https://n1kh11.com) — Next.js portfolio with experience, projects, writing, Spotify, and an interactive globe (Nikhil's Wrld).

## Stack

- Next.js + TypeScript + Tailwind
- Framer Motion
- Cloudflare Pages (Spotify API functions)
- `react-globe.gl` for `/wrld`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Built for Cloudflare Pages (`out/` via `pages_build_output_dir` in `wrangler.toml`).

Spotify endpoints under `functions/api/` need `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` set in the Pages project env.
