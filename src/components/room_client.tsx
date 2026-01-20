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
  const [screen, setScreen] = useState<string>("home");
  const [searchedTracks, setSearchedTracks] = useState<any>(props.tracks);
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
    let search_request = await fetch(
      `/api/spotifysearch?roomid=${encodeURIComponent(
        props.room_id
      )}&value=${encodeURIComponent(search)}`
    );
    let response = await search_request;
    if (response.ok) {
      let response_json = await response.json();
      setSearchedTracks(response_json.data.tracks);
    }
  };

  const playHandler = async (uri: string) => {
    let request = await fetch("/api/addSong", {
      method: "POST",
      body: JSON.stringify({
        song_uri: uri,
        room_id: props.room_id
      })
    });
    //socket?.emit("play", props.room_id, uri);
  };

  function SearchScreen() {
    return (
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
            {searchedTracks?.items?.map((item: any) => {
              let img = item?.album?.images.reduce(
                (smallest: imageType, curr: imageType) => {
                  if (curr.width < smallest.width) return curr;
                  return smallest;
                }
              );
              return (
                <div className="w-full h-auto" key={item.id}>
                  <div
                    className="flex justify-start items-center w-full min-h-[100px] my-1 p-3 rounded-2xl hover:bg-neutral-700 cursor-pointer"
                    onClick={() => playHandler(item.uri)}
                  >
                    <Avatar>
                      <AvatarImage src={img.url}></AvatarImage>
                      <AvatarFallback>Song</AvatarFallback>
                    </Avatar>
                    <div className="p-3 overflow-hidden">
                      <p className="text-xl">{item.name}</p>
                      <p className="text-xs">
                        {item?.album?.artists
                          ?.map((artist: any) => artist.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  function HomeScreen() {
    return (
      <div className="h-3/4 w-1/2">
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
                <div className="w-full h-auto" key={item.id}>
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
    );
  }

  return (
    <div className="size-full flex flex-col items-center justify-start">
      <div className="w-full max-h-sm gap-2 flex items-center justify-start px-4 py-2">
        <Button variant="link" onClick={(ev) => setScreen("home")}>
          Home
        </Button>
        <Separator orientation="vertical" />
        <Button variant="link" onClick={(ev) => setScreen("search")}>
          Search
        </Button>
      </div>
      <SpotifyPlayer
        access_token={props.access_token}
        room_id={props.room_id}
      />
      {screen === "home" ? HomeScreen() : SearchScreen()}
    </div>
  );
}
