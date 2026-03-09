import { Metadata } from "next";
import roomList from "@/modules/room-list";
import spotifyHandler from "@/modules/spotify-handler";
import RoomClient from "@/components/room-client";

export const metadata: Metadata = {
  title: "Room - Jukebox",
};

interface RoomPageProps {
  searchParams: Promise<{ room_id: string }>;
}

export default async function RoomPage({ searchParams }: RoomPageProps) {
  const { room_id: roomId } = await searchParams;
  const room = roomList.getRoom(roomId);

  if (!room?.tokenInfo?.access_token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Room Not Found</h1>
          <p className="text-muted-foreground">
            The room does not exist or is not configured correctly.
          </p>
        </div>
      </div>
    );
  }

  const trackIds = room.getQueue();
  const tracksRequest = await spotifyHandler.getSongsFromUris(
    trackIds,
    room.tokenInfo.access_token
  );
  
  const tracks = tracksRequest 
    ? { items: tracksRequest.tracks } 
    : { items: [] };

  return (
    <div className="h-screen w-screen">
      <RoomClient
        accessToken={room.tokenInfo.access_token}
        tracks={tracks}
        roomId={roomId}
      />
    </div>
  );
}
