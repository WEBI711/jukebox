import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socketTypes"
import room_list from "./roomlist";
import spotifyHandler from "./spotifyHandler";
class socket_server {
  socket;
  port = 4000;
  constructor() {
    try {
      const io = new Server(4000, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ["*"],
          credentials: true
        }
      });
      io.on("connection", (socket) => {
        console.log('new connection')
        socket.onAny((event, ...args) => {
          console.log("📩 server got event:", event, args);
        });
        socket.on('joinRoom', (room_id) => {
          // check if room exists
          let room = room_list.get_room(room_id)
          if (room) {
            // if room exists emit roomJoined
            console.log(`socket joined room: ${room_id}`)
            socket.join(room_id);
            socket.emit('roomJoined');
            return
          }
          // if room doesnt exist emit errorJoiningRoom
          socket.emit('errorJoiningRoom');
        })
        socket.on('play', (room_id, uri) => {
          let room = room_list.get_room(room_id);
          let token_info = room.token_info;
          spotifyHandler.play_song(uri, token_info);
        })
      });
      this.socket = io;
    } catch (err) {
      console.log(`Error initialising socket instance for room. port_number: ${this.port}`)
    }
  }
  check() {
    if (this.socket)
      return true;
    return false;
  }
}
// --- Singleton pattern ---
const globalForServerList = global as unknown as { server?: socket_server };

const server =
  globalForServerList.server ?? new socket_server();

if (!globalForServerList.server) {
  globalForServerList.server = server;
}

export default server;
