'use client'
import Script from "next/script";
export default function startserver(){
    let spotifyloginhandler = (ev: any) => {
        fetch('/api/spotifylogin');
    }
    return(
        <div className="w-full h-screen flex justify-center align-center">
            <Script src="https://sdk.scdn.co/spotify-player.js"/>
            <button onClick={spotifyloginhandler}>login to spotify</button>
        </div>
    )
}