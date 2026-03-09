"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SpotifyImage, SpotifyTrack } from "@/modules/spotify-handler";

interface HomeScreenProps {
  queueTracks: { items: SpotifyTrack[] };
}

function getSmallestImage(images: SpotifyImage[]): SpotifyImage | undefined {
  return images?.reduce((smallest, current) =>
    current.width < smallest.width ? current : smallest
  );
}

export default function HomeScreen({ queueTracks }: HomeScreenProps) {
  const tracks = queueTracks?.items ?? [];

  return (
    <div className="h-3/4 w-1/2">
      <ScrollArea className="size-full rounded-md border p-4">
        <div className="size-full overflow-hidden">
          {tracks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No songs in queue yet
            </p>
          ) : (
            tracks.map((track) => {
              const image = getSmallestImage(track.album.images);
              
              return (
                <div className="w-full h-auto" key={track.id}>
                  <div className="flex justify-start items-center w-full min-h-[100px] my-1 p-3 rounded-2xl">
                    <Avatar>
                      <AvatarImage src={image?.url} />
                      <AvatarFallback>Song</AvatarFallback>
                    </Avatar>
                    <div className="p-3 overflow-hidden">
                      <p className="text-xl">{track.name}</p>
                      <p className="text-xs">{track.album.name}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
