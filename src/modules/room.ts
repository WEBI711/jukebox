import { Server } from "socket.io";
import spotifyHandler from "./spotifyHandler";
interface IRoom {
    socket: Server | null;
    port: number;
    spotify_handler: spotifyHandler;
}
export default class room implements IRoom {
    room_id: string;
    socket: Server | null;
    spotify_handler: spotifyHandler;
    port: number;
    constructor(port: number, _spotify_handler: spotifyHandler){
        this.port = port;
        this.socket = null;
        this.spotify_handler = _spotify_handler;
        this.room_id = port.toString(); // TODO: Need to replace with uuid of some sort
        this.initialize_socket(port);
    }
    initialize_socket(port: number){
        try{
            const io = new Server(port, { /* options */ });
            io.on("connection", (socket) => {
                console.log('new connection')
            });
            this.socket = io;
        } catch (err){
            console.log(`Error initialising socket instance for room. port_number: ${port}`)
        }
    }
}