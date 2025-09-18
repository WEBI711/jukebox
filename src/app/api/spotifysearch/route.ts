import { NextResponse, NextRequest } from "next/server";
import spotifyHandler from '@/modules/spotifyHandler'
import { error } from "console";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const value = searchParams.get('value')
    const room_id = searchParams.get('roomid')


    return NextResponse.json({ test: 'test' })
}