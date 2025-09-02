import server from "./server";
import tokenManager from "./spotifyTokenManager";

class serverlist {
    server_list: any[];
    port_series: number;
    constructor(){
        this.server_list = []
        this.port_series = 4*1000 // might make constructor argument later
    }
    get_list(){
        return this.server_list;
    }
    async add_server(spotify_auth_code: string){
        let auth_code = spotify_auth_code;
        let [instance, port] = this.start_new_socket();
        let token = await tokenManager.getToken(auth_code);
        if(instance && auth_code && token){
            let server_info = {room_id: port, instance, auth_code, token}
            this.server_list.push(server_info);
            return server_info;
        }
        else{
            throw new Error("Unable to add server");
        }
    }
    start_new_socket(){
        let instance = null;
        let port = null;
        try{
            if(!this.server_list.length){
                port = this.port_series;
                instance = server.start(port);
            }
            else{
                let taken_ports = this.taken_ports(this.server_list);
                port = this.new_port(taken_ports);
                if(port){
                    instance = server.start(port);
                }
                else
                    console.log('No ports available')
            }
        }
        catch(err){
            console.log(err)
        }
        return [instance, port];
    }
    taken_ports(server_list: any[]): number[]{
        let port_list = [];
        for(let srvr of server_list){
            let address = srvr.instance.httpServer.address();
            let port = address.port;
            port_list.push(port)
        }
        return port_list;
    }
    new_port(taken_ports: number[]): number|null{
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
        let room = this.server_list.filter(item => item.room_id == room_id)?.[0] || null;
        return room;
    }
}
// --- Singleton pattern ---
const globalForServerList = global as unknown as { serverlist?: serverlist };

const server_list =
  globalForServerList.serverlist ?? new serverlist();

if (!globalForServerList.serverlist) {
  globalForServerList.serverlist = server_list;
}

export default server_list