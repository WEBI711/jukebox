import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import roomList from "./room-list";
import spotifyHandler from "./spotify-handler";

class SocketServer {
  socket: Server<ClientToServerEvents, ServerToClientEvents> | null = null;
  private readonly port = 4000;

  constructor() {
    try {
      const io = new Server<ClientToServerEvents, ServerToClientEvents>(this.port, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ["*"],
          credentials: true,
        },
      });

      io.on("connection", (socket) => {
        console.log("New socket connection");

        socket.onAny((event, ...args) => {
          console.log("📩 Server received event:", event, args);
        });

        socket.on("joinRoom", (roomId) => {
          const room = roomList.getRoom(roomId);
          
          if (room) {
            console.log(`Socket joined room: ${roomId}`);
            socket.join(roomId);
            socket.emit("roomJoined");
            return;
          }
          
          socket.emit("errorJoiningRoom");
        });

        socket.on("play", (roomId, uri) => {
          const room = roomList.getRoom(roomId);
          
          if (room) {
            spotifyHandler.playSong(uri, room.tokenInfo);
          }
        });
      });

      this.socket = io;
    } catch (err) {
      console.error(`Error initializing socket server on port ${this.port}:`, err);
    }
  }

  check(): boolean {
    return this.socket !== null;
  }
}

// Singleton pattern
const globalForServer = global as unknown as { socketServer?: SocketServer };

const socketServer = globalForServer.socketServer ?? new SocketServer();

if (!globalForServer.socketServer) {
  globalForServer.socketServer = socketServer;
}

export default socketServer;
