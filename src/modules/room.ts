import { Socket } from "socket.io-client";
import spotifyHandler from "./spotifyHandler";
interface IRoom {
    socket: Socket | null;
    spotify_handler: spotifyHandler;
    room_id: string,
}
export default class room implements IRoom {
    room_id: string;
    socket: Socket | null;
    spotify_handler: spotifyHandler;
    constructor(_spotify_handler: spotifyHandler, room_id: string) {
        this.room_id = room_id
        this.spotify_handler = _spotify_handler;
        this.socket = null;
    }
    add_socket(socket: Socket) {
        this.socket = socket;
    }
}