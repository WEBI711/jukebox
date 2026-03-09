import crypto from "crypto";
import { redirect, RedirectType } from "next/navigation";
import { SpotifyTokenInfo } from "@/types/spotify-token";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? "";
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI ?? "";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export default class SpotifyHandler {
  static authCodeRequest(): void {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Spotify client_id or client_secret not configured");
    }

    const state = generateSecureRandomString(16);
    const scope = [
      "streaming",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-private",
      "user-read-email",
    ].join(" ");

    const spotifyLoginUrl = new URL(SPOTIFY_AUTH_URL);
    spotifyLoginUrl.searchParams.set("response_type", "code");
    spotifyLoginUrl.searchParams.set("client_id", CLIENT_ID);
    spotifyLoginUrl.searchParams.set("scope", scope);
    spotifyLoginUrl.searchParams.set("state", state);
    spotifyLoginUrl.searchParams.set("redirect_uri", REDIRECT_URI);

    redirect(spotifyLoginUrl.toString(), RedirectType.push);
  }

  static async tokenRequest(authCode: string): Promise<SpotifyTokenInfo | null> {
    try {
      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        body: new URLSearchParams({
          code: authCode,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error("Error requesting Spotify token:", err);
    }

    return null;
  }

  static async searchSong(query: string, tokenInfo: SpotifyTokenInfo): Promise<Response | null> {
    try {
      const url = new URL(`${SPOTIFY_API_BASE}/search`);
      url.searchParams.set("q", query);
      url.searchParams.set("type", "track");

      return await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
        },
      });
    } catch (err) {
      console.error("Error searching for song:", err);
      return null;
    }
  }

  static async playSong(uri: string, tokenInfo: SpotifyTokenInfo): Promise<unknown | null> {
    try {
      const response = await fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
        },
        body: JSON.stringify({
          uris: [uri],
        }),
      });

      return await response.json();
    } catch (err) {
      console.error("Error playing song:", err);
      return null;
    }
  }

  static async transferPlayback(playerId: string, accessToken: string): Promise<Response | null> {
    try {
      return await fetch(`${SPOTIFY_API_BASE}/me/player`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ device_ids: [playerId] }),
      });
    } catch (err) {
      console.error("Error transferring playback:", err);
      return null;
    }
  }

  static async getSongsFromUris(ids: string[], accessToken: string): Promise<SpotifyTracksResponse | null> {
    if (!ids.length) {
      return null;
    }

    try {
      const idsParam = ids.join(",");
      const response = await fetch(`${SPOTIFY_API_BASE}/tracks?ids=${idsParam}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await response.json();
    } catch (err) {
      console.error("Error fetching songs from URIs:", err);
      return null;
    }
  }
}

function generateSecureRandomString(length = 16): string {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}

// Type for Spotify API response
export interface SpotifyTracksResponse {
  tracks: SpotifyTrack[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    name: string;
    images: SpotifyImage[];
  };
  artists: SpotifyArtist[];
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyArtist {
  name: string;
}
