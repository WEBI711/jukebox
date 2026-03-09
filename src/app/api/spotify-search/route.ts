import { NextRequest, NextResponse } from "next/server";
import roomList from "@/modules/room-list";
import spotifyHandler from "@/modules/spotify-handler";

export async function GET(req: NextRequest): Promise<Response> {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const roomId = searchParams.get("roomId");

  if (!roomId || !query) {
    return NextResponse.json(
      { error: "Missing roomId or query" },
      { status: 400 }
    );
  }

  const room = roomList.getRoom(roomId);

  if (!room?.tokenInfo) {
    return NextResponse.json(
      { error: "Room not found" },
      { status: 404 }
    );
  }

  const searchResponse = await spotifyHandler.searchSong(query, room.tokenInfo);

  if (!searchResponse) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }

  const data = await searchResponse.json();
  return NextResponse.json({ data }, { status: searchResponse.status });
}
