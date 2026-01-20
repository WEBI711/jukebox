import room_list from "@/modules/roomlist";
export async function POST(request: Request) {
  try {
    let body = await request.json();
    const { song_uri, room_id } = body;
    if (!room_id || !song_uri)
      throw new Error("request body did not contain all required fields.")
    let room = room_list.get_room(room_id);
    if (!room)
      throw new Error(`Room not found agains id: ${room_id}`);
    try {
      room.add_song(song_uri);
    }
    catch (err) {
      console.log(`Error adding song with uri: ${song_uri} to room with room_id: ${room_id}`);
      console.log(err);
    }
    return new Response(null, { status: 200 });
    // Add song to room queue
  } catch (err) {
    console.log("Error adding song to server queue")
    console.log(err)
    return new Response(null, { status: 500 })
  }
}

