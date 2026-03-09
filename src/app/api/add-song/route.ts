import { NextResponse } from "next/server";
import roomList from "@/modules/room-list";

interface AddSongRequest {
  songId: string;
  roomId: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as AddSongRequest;
    const { songId, roomId } = body;

    if (!roomId || !songId) {
      return NextResponse.json(
        { error: "Missing required fields: roomId and songId" },
        { status: 400 }
      );
    }

    const room = roomList.getRoom(roomId);
    
    if (!room) {
      return NextResponse.json(
        { error: `Room not found: ${roomId}` },
        { status: 404 }
      );
    }

    await room.addSong(songId);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error adding song to queue:", error);
    return NextResponse.json(
      { error: "Failed to add song" },
      { status: 500 }
    );
  }
}
