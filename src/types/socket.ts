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
  joinRoom: (roomId: string) => void;
  play: (roomId: string, uri: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
