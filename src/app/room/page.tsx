import room_list from "@/modules/roomlist";
import RoomClient from "@/components/room_client";
import spotifyHandler from "@/modules/spotifyHandler";
type roomProps = {
  searchParams: { room_id: string };
};
export default async function Room({ searchParams }: roomProps) {
  searchParams = await searchParams;
  let room = room_list.get_room(searchParams.room_id);
  let track_ids = room.get_queue();
  // TODO: explore the use of revalidateTag here instead of refreshing route on client side.
  let tracks_request = await spotifyHandler.get_songs_from_uris(track_ids, room.token_info.access_token);
  let tracks_for_home = tracks_request ? { items: tracks_request.tracks } : { items: [] };
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
