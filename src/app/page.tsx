import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import HomePageButtons from "@/components/homepage-buttons";
import server from "@/modules/socketio_server";
import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/api/spotifylogin');
  //if (server.check()) console.log("Server socket is up and running");
  //const words = [
  //  { text: "Welcome" },
  //  { text: "to" },
  //  { text: "JukeBox.", className: "text-blue-500 dark:text-blue-500" },
  //];
  //return (
  //  <div>
  //    Hello world!
  //  </div>
  //);
}
