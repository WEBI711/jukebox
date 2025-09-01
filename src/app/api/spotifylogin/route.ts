import { NextResponse } from "next/server";
import crypto from 'crypto';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET(req: Request){
    if(!client_id || !client_secret){
        return NextResponse.json({error: "Spotify client_id or client_secret not configured"})
    }
    var redirect_uri = "http://localhost:3000/api/spotifylogin/callback"
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

    // TESTING REMOVE
    let str = sptify_loginURL.toString()

    return NextResponse.redirect(sptify_loginURL.toString())
}


function generateSecureRandomString(length = 16) {
  return crypto.randomBytes(length)
    .toString("base64") // encodes as base64
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumerics
    .slice(0, length);
}