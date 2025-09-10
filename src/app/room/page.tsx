import room_list from '@/modules/roomList'
import SpotifyPlayer from '@/components/spotifyplayer'
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';
import { cn } from "@/lib/utils"
type roomProps = {
    searchParams: {room_id: string,}
}
type SliderProps = React.ComponentProps<typeof Slider>
export default async function Room({searchParams}: roomProps){
    searchParams = await searchParams;
    console.log(room_list.get_list())
    let room = room_list.get_room(searchParams.room_id)
    let access_token = room?.spotify_handler?.token_object?.access_token || null
    if(access_token){
        return(
            <div>
                <Button>Welcome to room</Button>
                <SpotifyPlayer access_token={access_token} />
                <Slider defaultValue={[33]} max={100} step={1} className='w-50'/>
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