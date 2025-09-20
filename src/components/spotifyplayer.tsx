"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
type SpotifyPlayerProps = {
  access_token: string;
  room_id: string;
};
type listenerArgsTypes = {
  device_id: any | null;
  message: string | null;
};
export default function SpotifyPlayer(props: SpotifyPlayerProps) {
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    // When Spotify sets up window.onSpotifyWebPlaybackSDKReady
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Next.js Spotify Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(props.access_token); // pass your access token here
        },
        volume: 0.5,
      });

      // Ready
      player.addListener("ready", ({ device_id }: listenerArgsTypes) => {
        debugger;
        console.log("Ready with Device ID", device_id);
        let queryParams = new URLSearchParams({
          player_id: device_id,
          room_id: props.room_id,
        });
        fetch("/api/spotifyplaybacktransfer?" + queryParams.toString());
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }: listenerArgsTypes) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Errors
      player.addListener(
        "initialization_error",
        ({ message }: listenerArgsTypes) => console.error(message)
      );
      player.addListener(
        "authentication_error",
        ({ message }: listenerArgsTypes) => console.error(message)
      );
      player.addListener("account_error", ({ message }: listenerArgsTypes) =>
        console.error(message)
      );

      player.connect();
      setPlayer(player);
    };
  }, []);
  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </>
  );
}
