import {TypewriterEffectSmooth} from '@/components/ui/typewriter-effect'
import HomePageButtons from '@/components/homepage-buttons';
import server from '@/modules/socketio_server';
export default function Home(){
    if(server.check())
        console.log("Server socket is up and running")
    const words = [
        { text: "Welcome", },
        { text: "to", },
        { text: "JukeBox.", className: "text-blue-500 dark:text-blue-500", },
    ];
    return(
        <div className="flex flex-col items-center justify-center h-[40rem]">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
                Play your own music
            </p>
            <TypewriterEffectSmooth words={words} />
            <HomePageButtons/>
        </div>
    )
}