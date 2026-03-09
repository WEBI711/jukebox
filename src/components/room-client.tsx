"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SpotifyPlayer from "@/components/spotify-player";
import HomeScreen from "@/components/home-screen";
import SearchScreen from "@/components/search-screen";
import useRoomSocket from "@/hooks/useRoomSocket";
import { TrackList } from "@/types/track";
import { useEffect, useState } from "react";

interface RoomClientProps {
  accessToken: string;
  tracks: TrackList;
  roomId: string;
}

type ScreenType = "home" | "search";

export default function RoomClient({ accessToken, tracks, roomId }: RoomClientProps) {
  useRoomSocket(roomId);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [queueTracks, setQueueTracks] = useState<TrackList>(tracks);

  useEffect(() => {
    setQueueTracks(tracks);
  }, [tracks]);

  const handlePlay = async (songId: string) => {
    try {
      await fetch("/api/add-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, songId }),
      });
    } catch (error) {
      console.error("Failed to add song:", error);
    }
  };

  return (
    <div className="size-full flex flex-col items-center justify-start">
      <nav className="w-full max-h-sm gap-2 flex items-center justify-start px-4 py-2">
        <Button 
          variant="link" 
          onClick={() => setCurrentScreen("home")}
          aria-current={currentScreen === "home" ? "page" : undefined}
        >
          Home
        </Button>
        <Separator orientation="vertical" />
        <Button 
          variant="link" 
          onClick={() => setCurrentScreen("search")}
          aria-current={currentScreen === "search" ? "page" : undefined}
        >
          Search
        </Button>
      </nav>
      
      <SpotifyPlayer accessToken={accessToken} roomId={roomId} />
      
      {currentScreen === "home" ? (
        <HomeScreen queueTracks={queueTracks} />
      ) : (
        <SearchScreen roomId={roomId} onPlay={handlePlay} />
      )}
    </div>
  );
}
