'use client'
import Link from 'next/link'
export default function Home(){

    let server_handler = (ev: any) => {
       return
    }
    let client_handler = (ev: any) => {
       return
    }
    return(
        <div className="flex justify-center items-center w-screen h-screen">
            <Link href="/startserver">
                <button className="p-3 cursor-pointer" onClick={server_handler}>start server</button>
            </Link>
            <button className="p-3 cursor-pointer" onClick={client_handler}>join server</button>
        </div>
    )
}