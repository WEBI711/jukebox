import room_list from "@/modules/roomList";
import RoomClient from "@/components/room_client";
import tracksobject from "public/mocktracks";
type roomProps = {
  searchParams: { room_id: string };
};
export default async function Room({ searchParams }: roomProps) {
  searchParams = await searchParams;
  let room = room_list.get_room(searchParams.room_id);
  let access_token = room?.spotify_handler?.token_object?.access_token || null;
  if (access_token) {
    return (
      <div className="flex items-center justify-center size-full">
        <RoomClient
          access_token={access_token}
          tracks={tracksobject.tracks}
          room_id={searchParams.room_id}
        />
      </div>
    );
  } else {
    return (
      <div>
        <div>room not found or configured correctly</div>
      </div>
    );
  }
}
