'use client'
import SpotifyPlayer from '@/components/spotifyplayer'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {io, Socket} from "socket.io-client"
import { useEffect, useState } from 'react'
import type {ServerToClientEvents, ClientToServerEvents} from '@/types/socketTypes'
                                    
type imageType = {
    url: string,
    width: number,
    height: number
}
type track = {
    items: any[]
}
type propsType = {
    access_token: string,
    tracks: track,
    server_socket_port: string,
}
export default function RoomClient(props: propsType){
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
    useEffect(() => {
        const _socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:4000`, {
            transports: ["websocket", "polling"], // ensure both are allowed
            withCredentials: true
        });
        _socket.on('connect', () => {
            console.log('connected')
            _socket.emit('joinRoom',"room")
        })
        setSocket(_socket);
    },[])
    return (
        <>
            <SpotifyPlayer access_token={props.access_token} />
            <ScrollArea className="h-3/4 w-1/2 rounded-md border p-4">
                <div className='size-full overflow-hidden'>
                    {props.tracks.items.map((item: any) => {
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
        </>
    )
}