import { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import { redirect, RedirectType } from 'next/navigation'
import room_list from '@/modules/roomList';

export async function GET(req: NextRequest){
    let server_info = null;
    try{
        const searchParams = req.nextUrl.searchParams
        const code = searchParams.get('code');
        // TODO: Logic to check this against initail state to protect agains xsr attacks
        const state = searchParams.get('state')
        // Add code to start server room and redirect to room
        if(code){
            // TODO: fix type
            server_info = await room_list.add(code)
        }
    } catch(err) {
        console.log(err)
        return NextResponse.json({error: err})
    }

    if(server_info)
        return redirect(`/room?room_id=${server_info.room_id}`, RedirectType.push)
    else
        return NextResponse.json({error: 'unable to add server'})
}
