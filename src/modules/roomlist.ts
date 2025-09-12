import Room from "./room";
import spotifyHandler from "./spotifyHandler";
import spotify_handler from "./spotifyHandler";
interface IRoomlist{
    rooms: Room[];
    port_series: number;
    add: (spotify_auth_code: string, room_id: string) => Promise<Room>; // add a room using {spotify_token_info, user_socket_id, room_name, room_id}
    get_list: () => Room[]; // get list of all available rooms
    get_room: (room_id: string) => Room | null;
}

class roomlist implements IRoomlist {
    rooms: Room[];
    port_series: number;
    constructor(){
        this.rooms = []
        this.port_series = 4*1000 // might make constructor argument later
    }
    get_list(){
        return this.rooms;
    }
    async add(spotify_auth_code: string, room_id: string){
        let spotify_handler = new spotifyHandler(spotify_auth_code);
        let response_obj = await spotify_handler.token_request(spotify_auth_code);
        if(response_obj)
            spotify_handler.token_object = response_obj;
        if(response_obj){
            let room = await new Room(spotify_handler, room_id);
            this.rooms.push(room);
            return room
        }
        else{
            throw new Error("Unable to add room. port or token info missing.");
        }
    }
    get_room(room_id: string){
        let room = this.rooms.filter(item => item.room_id == room_id)?.[0] || null;
        return room;
    }
}
// --- Singleton pattern ---
const globalForServerList = global as unknown as { roomlist?: roomlist };

const room_list =
  globalForServerList.roomlist ?? new roomlist();

if (!globalForServerList.roomlist) {
  globalForServerList.roomlist = room_list;
}

export default room_list;