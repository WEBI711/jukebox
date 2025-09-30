import room_list from '@/modules/roomlist';
import spotifyHandler from "@/modules/spotifyHandler";
import { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import { redirect, RedirectType } from 'next/navigation'
import room from '@/modules/room';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code');
    // TODO: Logic to check this against initail state to protect agains xsr attacks
    const state = searchParams.get('state')

    let room = null;
    try {
        if (code) {
            room = await create_new_room(code);
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err })
    }

    if (room)
        return redirect(`/room?room_id=${room.room_id}`, RedirectType.push)
    else
        return NextResponse.json({ error: 'unable to create room' })
}

// --- Helpers ---
async function create_new_room(spotify_auth_code: string) {
    const room_id = crypto.randomUUID();
    const token_info = await spotifyHandler.token_request(spotify_auth_code)
    if (token_info) {
        let new_room = new room(room_id, token_info)
        room_list.add(new_room)
        return new_room;
    }
    return null
}
