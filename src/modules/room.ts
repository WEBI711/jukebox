import { Socket } from "socket.io-client";
import spotifyHandler from "./spotifyHandler";
import { spotifyTokenInfoType } from "@/types/spotifyToken";
interface IRoom {
    room_id: string,
    token_info: spotifyTokenInfoType, // TODO: give it proper typing
}
export default class room implements IRoom {
    room_id;
    token_info;
    constructor(room_id: string, token_info: spotifyTokenInfoType) {
        this.room_id = room_id;
        this.token_info = token_info;
    }
}