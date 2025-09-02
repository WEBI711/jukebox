import serverlist from '@/modules/serverlist'
import SpotifyPlayer from '@/components/spotifyplayer'
type roomProps = {
    searchParams: {room_id: string,}
}
export default async function Room({searchParams}: roomProps){
    searchParams = await searchParams;
    console.log(serverlist.get_list())
    let room = serverlist.get_room(searchParams.room_id)
    let access_token = room?.token?.access_token || null
    if(access_token){
        return(
            <div>
                <div>Welcome to room</div>
                <SpotifyPlayer access_token={access_token} />
            </div>
        )
    }
    else{
        return(
            <div>
                <div>room not found or configured correctly</div>
            </div>
        )
    }
}