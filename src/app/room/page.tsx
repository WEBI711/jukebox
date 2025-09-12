import room_list from '@/modules/roomList'
import SpotifyPlayer from '@/components/spotifyplayer'
import { ScrollArea } from "@/components/ui/scroll-area"
import tracksobject from 'public/mocktracks'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
                                    
type roomProps = {
    searchParams: {room_id: string,}
}
type imageType = {
    url: string,
    width: number,
    height: number
}
export default async function Room({searchParams}: roomProps){
    searchParams = await searchParams;
    console.log(room_list.get_list())
    let room = room_list.get_room(searchParams.room_id)
    let access_token = room?.spotify_handler?.token_object?.access_token || null
    if(access_token){
        return(
            <div className='flex items-center justify-center size-full'>
                <SpotifyPlayer access_token={access_token} />
                <ScrollArea className="h-3/4 w-1/2 rounded-md border p-4">
                    <div className='size-full overflow-hidden'>
                        {tracksobject.tracks.items.map((item: any) => {
                            let img = item?.album?.images.reduce((smallest: imageType, curr: imageType) => {
                                if(curr.width < smallest.width)
                                    return curr
                                return smallest
                            })
                            return (
                                <div className='w-full h-auto'>
                                    <div className='flex justify-start items-center w-full min-h-[100px] my-1 p-3 rounded-2xl'>
                                        <Avatar>
                                            <AvatarImage src={img.url}></AvatarImage>
                                            <AvatarFallback>Song</AvatarFallback>
                                        </Avatar>
                                        <div className='p-3 overflow-hidden'>
                                            <p className='text-xl'>{item.name}</p>
                                            <p className='text-xs'>{item.album.name}</p>
                                        </div>
                                    </div>
                                    <Separator/>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
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