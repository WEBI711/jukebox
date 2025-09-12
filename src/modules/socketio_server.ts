import { Server } from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "@/types/socketTypes"
class socket_server {
    server;
    port=4000;
    constructor(){
        try{
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
                socket.on('joinRoom', (room) => {
                    console.log(`socket joined room: ${room}`)
                    socket.join(room);
                })

            });
            this.server = io;
        } catch (err){
            console.log(`Error initialising socket instance for room. port_number: ${this.port}`)
        }
    }
    check(){
        if(this.server)
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