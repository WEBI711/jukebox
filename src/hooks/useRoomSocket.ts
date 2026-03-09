import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/socket";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

export default function useRoomSocket(
  roomId: string
): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_SERVER_URL,
      {
        transports: ["websocket", "polling"],
        withCredentials: true,
      }
    );

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("joinRoom", roomId);
    });

    newSocket.on("roomJoined", () => {
      console.log("Room joined successfully");
    });

    newSocket.on("errorJoiningRoom", () => {
      console.error("Error joining room. Retrying...");
      setTimeout(() => {
        newSocket.emit("joinRoom", roomId);
      }, 10000);
    });

    newSocket.on("playlist_update", (uri) => {
      console.log(`New song added to playlist: ${uri}`);
      router.refresh();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, router]);

  return socket;
}
