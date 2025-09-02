import { NextResponse } from "next/server";
import spotifyHandler from '@/modules/spotifyHandler'
import { error } from "console";

export async function GET(req: Request){
    spotifyHandler.auth_code_request()
    return NextResponse.json({test: 'test'})
}

