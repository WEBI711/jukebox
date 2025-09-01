import { Server } from "socket.io";

export default {
    start: (port: number) => {
        const io = new Server(port, { /* options */ });

        io.on("connection", (socket) => {
            console.log('new connection')
        });

        return io;
    }
}