import { NextRequest, NextResponse } from "next/server";
import roomList from "@/modules/room-list";
import spotifyHandler from "@/modules/spotify-handler";

export async function GET(req: NextRequest): Promise<Response> {
  const searchParams = req.nextUrl.searchParams;
  const playerId = searchParams.get("playerId");
  const roomId = searchParams.get("roomId");

  if (!playerId || !roomId) {
    return NextResponse.json(
      { error: "Missing playerId or roomId" },
      { status: 400 }
    );
  }

  const room = roomList.getRoom(roomId);

  if (!room?.tokenInfo?.access_token) {
    return NextResponse.json(
      { error: "Room not found or invalid token" },
      { status: 404 }
    );
  }

  const response = await spotifyHandler.transferPlayback(
    playerId,
    room.tokenInfo.access_token
  );

  if (response?.status === 200) {
    return NextResponse.json({ message: "Playback transferred successfully" });
  }

  return NextResponse.json(
    { error: "Playback transfer failed" },
    { status: 500 }
  );
}
