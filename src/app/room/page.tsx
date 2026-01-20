import room_list from "@/modules/roomlist";
import RoomClient from "@/components/room_client";
import tracksobject from "public/mocktracks";
type roomProps = {
  searchParams: { room_id: string };
};
export default async function Room({ searchParams }: roomProps) {
  searchParams = await searchParams;
  let room = room_list.get_room(searchParams.room_id);
  let tracks = room.get_queue();
  let tracks_for_home = tracksobject.tracks;
  let access_token = room?.token_info?.access_token || null;
  if (access_token) {
    return (
      <div className="h-screen w-screen">
        <RoomClient
          access_token={access_token}
          tracks={tracks_for_home}
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
