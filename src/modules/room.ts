import spotifyHandler from "./spotifyHandler";
import { spotifyTokenInfoType } from "@/types/spotifyToken";
import type { tracks } from "@/types/trackTypes"
import server from "@/modules/socketio_server"
interface IRoom {
  get_queue: () => string[];
}
export default class room implements IRoom {
  room_id: string;
  token_info: spotifyTokenInfoType;
  track_queue: string[];
  constructor(room_id: string, token_info: spotifyTokenInfoType) {
    this.room_id = room_id;
    this.token_info = token_info;
    this.track_queue = [];
  }
  get_queue() {
    return this.track_queue
  }
  add_song(uri: string) {
    this.track_queue = [...this.track_queue, uri];
    if (server.check()) {
      //server.socket?.to(this.room_id).emit("playlist_update", uri);
      server.socket?.emit("playlist_update", uri);
    }
  }
}
