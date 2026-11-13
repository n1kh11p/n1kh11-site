export async function onRequest(context) {
  const { env } = context;
  const client_id = env.SPOTIFY_CLIENT_ID;
  const client_secret = env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = env.SPOTIFY_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const basic = btoa(`${client_id}:${client_secret}`);

  try {
    // Get access token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });

    const { access_token } = await tokenRes.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: "Failed to get access token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch top artists for all three time ranges in parallel
    const timeRanges = ["short_term", "medium_term", "long_term"];
    const [shortRes, mediumRes, longRes] = await Promise.all(
      timeRanges.map((range) =>
        fetch(
          `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=20`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
      )
    );

    // Fetch top tracks for all three time ranges
    const [tracksShortRes, tracksMediumRes, tracksLongRes] = await Promise.all(
      timeRanges.map((range) =>
        fetch(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=10`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
      )
    );

    const [shortData, mediumData, longData, tracksShortData, tracksMediumData, tracksLongData] = await Promise.all([
      shortRes.json(),
      mediumRes.json(),
      longRes.json(),
      tracksShortRes.json(),
      tracksMediumRes.json(),
      tracksLongRes.json(),
    ]);

    // Process artists
    const processArtists = (data) =>
      (data.items || []).map((artist) => ({
        name: artist.name,
        genres: artist.genres,
        image: artist.images?.[0]?.url || null,
        url: artist.external_urls?.spotify,
        popularity: artist.popularity,
      }));

    // Build genre frequency map from medium_term (best balance)
    const genreMap = {};
    for (const artist of mediumData.items || []) {
      for (const genre of artist.genres || []) {
        genreMap[genre] = (genreMap[genre] || 0) + 1;
      }
    }

    // Sort genres by frequency and take top 10
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));

    // Process top tracks
    const processTracks = (data) =>
      (data.items || []).map((track) => ({
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images?.[0]?.url,
        url: track.external_urls?.spotify,
      }));

    return new Response(
      JSON.stringify({
        topArtists: {
          shortTerm: processArtists(shortData),
          mediumTerm: processArtists(mediumData),
          longTerm: processArtists(longData),
        },
        topGenres,
        topTracks: {
          shortTerm: processTracks(tracksShortData),
          mediumTerm: processTracks(tracksMediumData),
          longTerm: processTracks(tracksLongData),
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
