import { Server } from "socket.io";
interface IRoom {
    socket: Server | null;
    port: number;
    auth_code: string;
    token: any;
}
export default class room implements IRoom {
    room_id: string;
    socket: Server | null;
    auth_code: string;
    token: any;
    port: number;
    constructor(port: number, auth_code: string, token: any){
        this.port = port;
        this.socket = null;
        this.auth_code = auth_code;
        this.token = token;
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