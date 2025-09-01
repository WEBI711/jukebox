import CHome from '@/components/homepage_clientside';
import serverlist from '@/modules/serverlist';
export default function Home(){
    serverlist.add_server()
    serverlist.add_server()
    let list = serverlist.get_list()
    return(
        <div className="flex justify-center items-center w-screen h-screen">
            <CHome/>
        </div>
    )
}