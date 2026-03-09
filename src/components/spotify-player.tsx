"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface SpotifyPlayerProps {
  accessToken: string;
  roomId: string;
}

interface SpotifyPlayerInstance {
  addListener: (event: string, callback: (args: SpotifyListenerArgs) => void) => void;
  connect: () => void;
}

interface SpotifyListenerArgs {
  device_id?: string;
  message?: string;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayerInstance;
    };
    onSpotifyWebPlaybackSDKReady: (() => void) | null;
  }
}

const SPOTIFY_SDK_URL = "https://sdk.scdn.co/spotify-player.js";

export default function SpotifyPlayer({ accessToken, roomId }: SpotifyPlayerProps) {
  const [, setPlayer] = useState<SpotifyPlayerInstance | null>(null);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Jukebox Player",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: SpotifyListenerArgs) => {
        console.log("Spotify player ready with device ID:", device_id);
        
        if (device_id) {
          const queryParams = new URLSearchParams({
            playerId: device_id,
            roomId,
          });
          fetch(`/api/spotify-playback-transfer?${queryParams.toString()}`);
        }
      });

      player.addListener("not_ready", ({ device_id }: SpotifyListenerArgs) => {
        console.log("Spotify player offline, device ID:", device_id);
      });

      player.addListener("initialization_error", ({ message }: SpotifyListenerArgs) => {
        console.error("Spotify player initialization error:", message);
      });

      player.addListener("authentication_error", ({ message }: SpotifyListenerArgs) => {
        console.error("Spotify player authentication error:", message);
      });

      player.addListener("account_error", ({ message }: SpotifyListenerArgs) => {
        console.error("Spotify player account error:", message);
      });

      player.connect();
      setPlayer(player);
    };
  }, [accessToken, roomId]);

  return <Script src={SPOTIFY_SDK_URL} />;
}
