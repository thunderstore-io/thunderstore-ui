import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  /*
  This route is used for automated healthchecks / uptime monitors.
   */
  return new NextResponse("OK");
}
