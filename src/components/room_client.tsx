"use client";
import SpotifyPlayer from "@/components/spotifyplayer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/socketTypes";

type imageType = {
  url: string;
  width: number;
  height: number;
};
type track = {
  items: any[];
};
type propsType = {
  access_token: string;
  tracks: track;
  room_id: string;
};
export default function RoomClient(props: propsType) {
  const [search, setSearch] = useState("");
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  useEffect(() => {
    const _socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `http://localhost:4000`,
      {
        transports: ["websocket", "polling"], // ensure both are allowed
        withCredentials: true,
      }
    );
    _socket.on("connect", () => {
      console.log("connected");
      _socket.emit("joinRoom", props.room_id);
    });
    _socket.on("roomJoined", () => {
      console.log("Room joined successfully");
    });
    _socket.on("errorJoiningRoom", () => {
      console.log("There was an error joining the room. Trying again");
      setTimeout(() => {
        _socket.emit("joinRoom", props.room_id);
      }, 100000);
    });

    setSocket(_socket);
  }, []);

  const searchHandler = async () => {
    let track_obj = await fetch(
      `/api/spotifysearch?roomid=${encodeURIComponent(
        props.room_id
      )}&value=${encodeURIComponent(search)}`
    );
  };

  return (
    <div className="size-full flex flex-col items-center justify-center">
      <SpotifyPlayer access_token={props.access_token} />
      <div className="h-3/4 w-1/2">
        <div className="flex w-full items-center gap-2 py-5">
          <Input
            type="text"
            placeholder="Search"
            onChange={(ev) => {
              setSearch(ev.target.value);
            }}
          />
          <Button
            type="submit"
            variant="outline"
            onClick={(ev) => searchHandler()}
          >
            Search
          </Button>
        </div>

        <ScrollArea className="size-full rounded-md border p-4">
          <div className="size-full overflow-hidden">
            {props.tracks.items.map((item: any) => {
              let img = item?.album?.images.reduce(
                (smallest: imageType, curr: imageType) => {
                  if (curr.width < smallest.width) return curr;
                  return smallest;
                }
              );
              return (
                <div className="w-full h-auto">
                  <div className="flex justify-start items-center w-full min-h-[100px] my-1 p-3 rounded-2xl">
                    <Avatar>
                      <AvatarImage src={img.url}></AvatarImage>
                      <AvatarFallback>Song</AvatarFallback>
                    </Avatar>
                    <div className="p-3 overflow-hidden">
                      <p className="text-xl">{item.name}</p>
                      <p className="text-xs">{item.album.name}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
