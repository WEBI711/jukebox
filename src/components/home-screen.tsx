"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type imageType = {
  url: string;
  width: number;
  height: number;
};
type HomeScreenProps = {
  queueTracks: { items: any[] };
};
export default function HomeScreen(props: HomeScreenProps) {
  return (
    <div className="h-3/4 w-1/2">
      <ScrollArea className="size-full rounded-md border p-4">
        <div className="size-full overflow-hidden">
          {props.queueTracks?.items?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No songs in queue yet</p>
          ) : (
            props.queueTracks?.items?.map((item: any) => {
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
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
