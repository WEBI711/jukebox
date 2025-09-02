import Room from "./room";
import tokenManager from "./spotifyTokenManager";
interface IRoomlist{
    rooms: Room[];
    port_series: number;
    add: (spotify_auth_code: string) => Promise<Room>;
    get_list: () => Room[];
    taken_ports: (list: Room[]) => number[];
    available_port: (taken_ports: number[]) => number | null;
    get_room: (room_id: string) => Room | null;
}

class roomlist implements IRoomlist {
    rooms: Room[];
    port_series: number;
    constructor(){
        this.rooms = []
        this.port_series = 4*1000 // might make constructor argument later
    }
    get_list(){
        return this.rooms;
    }
    async add(spotify_auth_code: string){
        let taken_ports = this.taken_ports(this.rooms);
        let token = await tokenManager.getToken(spotify_auth_code);
        let new_port = this.available_port(taken_ports)
        if(new_port && token){
            let room = await new Room(new_port, spotify_auth_code, token);
            this.rooms.push(room);
            return room
        }
        else{
            throw new Error("Unable to add room. port or token info missing.");
        }
    }
    taken_ports(rooms: any[]): number[]{
        let port_list = [];
        for(let room of rooms){
            let port = room.port;
            port_list.push(port)
        }
        return port_list;
    }
    available_port(taken_ports: number[]): number|null{
        let new_port = this.port_series;
        for(let i = 0; i < 10; i++){
            if(!taken_ports.includes(new_port)){
                return new_port
            }
            new_port += 1
        }
        return null
    }
    get_room(room_id: string){
        let room = this.rooms.filter(item => item.room_id == room_id)?.[0] || null;
        return room;
    }
}
// --- Singleton pattern ---
const globalForServerList = global as unknown as { roomlist?: roomlist };

const room_list =
  globalForServerList.roomlist ?? new roomlist();

if (!globalForServerList.roomlist) {
  globalForServerList.roomlist = room_list;
}

export default room_list;