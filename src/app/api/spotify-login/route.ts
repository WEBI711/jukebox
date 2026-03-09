import { NextResponse } from "next/server";
import spotifyHandler from "@/modules/spotify-handler";

export async function GET(): Promise<Response> {
  spotifyHandler.authCodeRequest();
  return NextResponse.json({ status: "redirecting" });
}
