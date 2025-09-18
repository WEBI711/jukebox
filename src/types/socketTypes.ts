export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  roomJoined: () => void;
  errorJoiningRoom: () => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  joinRoom: (room: string) => void
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}