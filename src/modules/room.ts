import { Socket } from "socket.io-client";
import spotifyHandler from "./spotifyHandler";
import { spotifyTokenInfoType } from "@/types/spotifyToken";
import type { tracks } from "@/types/trackTypes"
interface IRoom {
    get_queue: () => tracks;
}
export default class room implements IRoom {
    room_id: string;
    token_info: spotifyTokenInfoType;
    track_queue: tracks;
    constructor(room_id: string, token_info: spotifyTokenInfoType) {
        this.room_id = room_id;
        this.token_info = token_info;
        this.track_queue = { items: [] };
    }
    get_queue() {
        return this.track_queue
    }
}