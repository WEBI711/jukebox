import room from "./room";
import Room from "./room";
import spotifyHandler from "./spotifyHandler";
import { spotifyTokenInfoType } from "@/types/spotifyToken";
interface IRoomlist {
    rooms: Room[];
    add: (spotify_auth_code: string, room_id: string) => Promise<Room>; // add a room using {spotify_token_info, user_socket_id, room_name, room_id}
    get_list: () => Room[]; // get list of all available rooms
    get_room: (room_id: string) => Room | null;
}

class roomlist implements IRoomlist {
    rooms: Room[];
    constructor() {
        this.rooms = []
    }
    get_list() {
        return [...this.rooms];
    }
    async add(spotify_auth_code: string, room_id: string) {
        let token_object = await this.get_token_obj(spotify_auth_code)
        if (token_object) {
            let room = await new Room(room_id, token_object);
            this.add_new_room(room)
            return room
        }
        else {
            throw new Error("Unable to add room. port or token info missing.");
        }
    }
    get_room(room_id: string) {
        let room = this.rooms.filter(item => item.room_id == room_id)?.[0] || null;
        return room;
    }

    // --- Helpers ---
    async get_token_obj(spotify_auth_code: string): Promise<spotifyTokenInfoType> {
        let spotify_handler = new spotifyHandler(spotify_auth_code);
        let response_obj = await spotify_handler.token_request(spotify_auth_code);
        return response_obj;
    }
    add_new_room(room: room) {
        this.rooms = [...this.rooms, room];
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