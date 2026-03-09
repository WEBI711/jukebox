"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SpotifyPlayer from "@/components/spotifyplayer";
import HomeScreen from "@/components/home-screen";
import SearchScreen from "@/components/search-screen";
import useRoomSocket from "@/hooks/useRoomSocket";

type track = {
  items: any[];
};
type propsType = {
  access_token: string;
  tracks: track;
  room_id: string;
};
export default function RoomClient(props: propsType) {
  const socket = useRoomSocket(props.room_id);
  const [screen, setScreen] = useState<string>("home");
  const [queueTracks, setQueueTracks] = useState<any>(props.tracks);
  useEffect(() => {
    setQueueTracks(props.tracks);
  }, [props.tracks]);

  const playHandler = async (song_id: string) => {
    let request = await fetch("/api/addSong", {
      method: "POST",
      body: JSON.stringify({
        room_id: props.room_id, song_id
      })
    });
    //socket?.emit("play", props.room_id, uri);
  };

  return (
    <div className="size-full flex flex-col items-center justify-start">
      <div className="w-full max-h-sm gap-2 flex items-center justify-start px-4 py-2">
        <Button variant="link" onClick={(ev) => setScreen("home")}>
          Home
        </Button>
        <Separator orientation="vertical" />
        <Button variant="link" onClick={(ev) => setScreen("search")}>
          Search
        </Button>
      </div>
      <SpotifyPlayer
        access_token={props.access_token}
        room_id={props.room_id}
      />
      {screen === "home"
        ? <HomeScreen queueTracks={queueTracks} />
        : <SearchScreen room_id={props.room_id} playHandler={playHandler} />
      }
    </div>
  );
}
