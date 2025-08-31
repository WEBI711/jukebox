export default function Home(){

    let server_handler = (ev: any) => {
       return
    }
    return(
        <div className="flex justify-center items-center w-screen h-screen">
            <button className="p-3 cursor-pointer" onClick={server_handler}>start server</button>
            <button className="p-3 cursor-pointer">join server</button>
        </div>
    )
}