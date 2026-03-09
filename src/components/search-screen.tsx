"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type imageType = {
  url: string;
  width: number;
  height: number;
};
type SearchScreenProps = {
  room_id: string;
  playHandler: (song_id: string) => Promise<void>;
};
export default function SearchScreen(props: SearchScreenProps) {
  const [search, setSearch] = useState("");
  const [searchedTracks, setSearchedTracks] = useState<any>([]);

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
                  onClick={() => props.playHandler(item.id)}
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
