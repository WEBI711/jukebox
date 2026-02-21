import crypto from 'crypto';
import { spotifyTokenInfoType } from '@/types/spotifyToken'
const client_id = process.env.SPOTIFY_CLIENT_ID || '';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI || '';
import { redirect, RedirectType } from 'next/navigation'

export default class spotifyHandler {
  auth_code: string;
  token_object: any;

  constructor(auth_code: string) {
    this.auth_code = auth_code
    this.token_object = null;
  }

  static auth_code_request() {
    if (!client_id || !client_secret) {
      console.log("Spotify client_id or client_secret not configured")
    }
    var state = generateSecureRandomString(16);
    var scope = [
      "streaming",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-private",
      "user-read-email"
    ].join(' ');
    const sptify_loginURL = new URL('https://accounts.spotify.com/authorize?');
    sptify_loginURL.searchParams.set('response_type', 'code');
    sptify_loginURL.searchParams.set('client_id', client_id);
    sptify_loginURL.searchParams.set('scope', scope);
    sptify_loginURL.searchParams.set('state', state);
    sptify_loginURL.searchParams.set('redirect_uri', redirect_uri);
    redirect(sptify_loginURL.toString(), RedirectType.push);
  }

  static async token_request(auth_code: string) {
    let response = null
    try {
      response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
          code: `${auth_code}`,
          redirect_uri: redirect_uri || '',
          grant_type: 'authorization_code'
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
      })
    } catch (err) {
      console.log(err)
    }
    if (response && response.ok) {
      response = await response.json();
    }
    return response
  }

  static async search_song(query: string, token_info: spotifyTokenInfoType) {
    let response = null
    try {
      const base_url = "https://api.spotify.com/v1/search?"
      const queryParams = new URLSearchParams({ q: query, type: "track" })
      const url = base_url + queryParams.toString()
      response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token_info.access_token,
        }
      })
    } catch (err) {
      console.log(err)
    }
    return response
  }

  static async play_song(uri: string, token_info: spotifyTokenInfoType) {
    let response = null
    try {
      const base_url = "https://api.spotify.com/v1/me/player/play"
      const url = base_url
      response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token_info.access_token,
        },
        body: JSON.stringify({
          'uris': [uri]
        })
      })
      response = await response.json()
    } catch (err) {
      console.log(err)
    }
    return response
  }

  static async transfer_playback(player_id: string, access_token: string) {
    let response = null
    try {
      const base_url = "https://api.spotify.com/v1/me/player"
      const url = base_url
      response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + access_token,
        },
        body: JSON.stringify({ device_ids: [player_id] })
      })
    } catch (err) {
      console.log(err)
    }
    return response
  }

  static async get_songs_from_uris(ids: string[], access_token: string) {
    let response = null
    if (!ids.length) {
      return null;
    }
    try {
      const base_url = "https://api.spotify.com/v1/tracks";
      const url = `${base_url}?ids=${ids.reduce((acc, curr) => acc + ',' + curr)}`
      response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + access_token,
        },
      })
      response = await response.json()
    } catch (err) {
      console.log(err)
    }
    return response
  }
}

function generateSecureRandomString(length = 16) {
  return crypto.randomBytes(length)
    .toString("base64") // encodes as base64
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumerics
    .slice(0, length);
}
