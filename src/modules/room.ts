import { SpotifyTokenInfo } from "@/types/spotify-token";
import server from "@/modules/socket-server";

export interface IRoom {
  getQueue: () => string[];
  addSong: (uri: string) => void;
}

export default class Room implements IRoom {
  roomId: string;
  tokenInfo: SpotifyTokenInfo;
  private trackQueue: string[];

  constructor(roomId: string, tokenInfo: SpotifyTokenInfo) {
    this.roomId = roomId;
    this.tokenInfo = tokenInfo;
    this.trackQueue = [];
  }

  getQueue(): string[] {
    return [...this.trackQueue];
  }

  addSong(uri: string): void {
    this.trackQueue = [...this.trackQueue, uri];
    
    if (server.check()) {
      server.socket?.emit("playlist_update", uri);
    }
  }
}
