import room from "./room";
import Room from "./room";
import { spotifyTokenInfoType } from "@/types/spotifyToken";
interface IRoomlist {
    rooms: Room[];
    add: (room: room) => void;
    get_list: () => Room[];
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

    async add(room: room) {
        this.rooms = [...this.rooms, room];
    }

    get_room(room_id: string) {
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