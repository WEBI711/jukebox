'use client'
import { redirect } from 'next/navigation'
export default function startserver(){
    let spotifyloginhandler = (ev: any) => {
        redirect('/api/spotifylogin');
    }
    return(
        <div className="w-full h-screen flex justify-center align-center">
            <button onClick={spotifyloginhandler}>login to spotify</button>
        </div>
    )
}