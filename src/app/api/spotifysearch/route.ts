import { NextResponse, NextRequest } from "next/server";
import room_list from "@/modules/roomList";
import spotifyHandler from '@/modules/spotifyHandler'
import { error } from "console";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const value = searchParams.get('value')
    const room_id = searchParams.get('roomid')

    if (!room_id || !value) {
        return NextResponse.json({ error: `Error in search request with room_id: ${room_id} and search string: ${value}` })
    }

    let room = room_list.get_room(room_id);
    let tokenInfo = room?.token_info;

    let searchResponse = await spotifyHandler.search_song(value, tokenInfo)
    return NextResponse.json({ trackData: searchResponse })
}