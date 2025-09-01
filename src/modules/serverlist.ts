import server from "./server";

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
    add_server(){
        let instance = this.start_new_socket();
        if(instance)
            this.server_list.push(instance);
    }
    start_new_socket(){
        let instance = null;
        try{
            if(!this.server_list.length){
                instance = server.start(3001)
            }
            else{
                let taken_ports = this.taken_ports(this.server_list);
                let new_port = this.new_port(taken_ports);
                if(new_port){
                    instance = server.start(new_port);
                }
                else
                    console.log('No ports available')
            }
        }
        catch(err){
            console.log(err)
        }
        return instance;
    }
    taken_ports(server_list: any[]): number[]{
        let port_list = [];
        for(let srvr of server_list){
            let address = srvr.httpServer.address();
            let port = address.port;
            port_list.push(port)
        }
        return port_list;
    }
    new_port(taken_ports: number[]): number|null{
        let new_port = 3001;
        for(let i = 0; i < 10; i++){
            if(!taken_ports.includes(new_port)){
                return new_port
            }
            new_port += 1
        }
        return null
    }
}
let serverlistinstance = new serverlist()
export default serverlistinstance;