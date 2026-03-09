import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/socketTypes";

export default function useRoomSocket(
  room_id: string
): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    const _socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `http://localhost:4000`,
      {
        transports: ["websocket", "polling"],
        withCredentials: true,
      }
    );
    _socket.on("connect", () => {
      console.log("connected");
      _socket.emit("joinRoom", room_id);
    });
    _socket.on("roomJoined", () => {
      console.log("Room joined successfully");
    });
    _socket.on("errorJoiningRoom", () => {
      console.log("There was an error joining the room. Trying again");
      setTimeout(() => {
        _socket.emit("joinRoom", room_id);
      }, 100000);
    });
    _socket.on("playlist_update", (uri) => {
      console.log(`New song added to list with uri ${uri}`);
      router.refresh();
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    };
  }, [room_id]);

  return socket;
}
