import { NextResponse, NextRequest } from "next/server";
import room_list from "@/modules/roomList";
import spotifyHandler from '@/modules/spotifyHandler'

export async function GET(req: NextRequest) {
    debugger
    const searchParams = req.nextUrl.searchParams;
    const player_id = searchParams.get('player_id');
    const room_id = searchParams.get('room_id');

    if (!player_id || !room_id) {
        return NextResponse.json({ error: `No or incorrect player ID supplied` })
    }

    let room = room_list.get_room(room_id);
    let tokenInfo = room?.token_info;

    let searchResponse = await spotifyHandler.transfer_playback(player_id, tokenInfo.access_token)
    if (searchResponse?.status === 200) {
        return NextResponse.json({ data: "transferred successfully" })
    }
    return NextResponse.json({ data: "transfer unsuccessful" })
}