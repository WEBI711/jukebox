export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  roomJoined: () => void;
  errorJoiningRoom: () => void;
  playlist_update: (uri: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  joinRoom: (room: string) => void // TODO: replace room with room_id
  play: (room_id: string, uri: string) => void // for testing
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
