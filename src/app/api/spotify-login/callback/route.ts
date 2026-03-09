import { NextRequest, NextResponse } from "next/server";
import { redirect, RedirectType } from "next/navigation";
import roomList from "@/modules/room-list";
import spotifyHandler from "@/modules/spotify-handler";
import Room from "@/modules/room";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // TODO: Validate state against initial state to protect against XSS attacks
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      throw new Error("Spotify endpoint did not return an auth code");
    }

    const room = await createNewRoom(code);

    if (!room) {
      throw new Error("Room creation unsuccessful");
    }

    return redirect(`/room?room_id=${room.roomId}`, RedirectType.push);
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

async function createNewRoom(spotifyAuthCode: string): Promise<Room | null> {
  const roomId = crypto.randomUUID();
  const tokenInfo = await spotifyHandler.tokenRequest(spotifyAuthCode);

  if (tokenInfo) {
    const newRoom = new Room(roomId, tokenInfo);
    await roomList.addRoom(newRoom);
    return newRoom;
  }

  return null;
}
