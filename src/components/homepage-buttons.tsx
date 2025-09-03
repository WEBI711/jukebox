'use client'
import { redirect } from 'next/navigation'
export default function HomePageButtons(){
    let spotifyloginhandler = (ev: any) => {
        redirect('/api/spotifylogin');
    }
    return(
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
            <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={spotifyloginhandler}>
                Create Server
            </button>
            <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                Join Server
            </button>
        </div>
    )
}