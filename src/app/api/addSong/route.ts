import room_list from "@/modules/roomlist";
export async function POST(request: Request) {
  try {
    let body = await request.json();
    const { song_id, room_id } = body;
    if (!room_id || !song_id)
      throw new Error("request body did not contain all required fields.")
    let room = room_list.get_room(room_id);
    if (!room)
      throw new Error(`Room not found agains id: ${room_id}`);
    try {
      await room.add_song(song_id);
      return new Response(null, { status: 200 });
    }
    catch (err) {
      console.log(`Error adding song with id: ${song_id} to room with room_id: ${room_id}`);
      console.log(err);
      return new Response(null, { status: 500 })
    }
  } catch (err) {
    console.log("Error adding song to server queue")
    console.log(err)
    return new Response(null, { status: 500 })
  }
}

