import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { method } = req;

  if (method !== "POST") {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/home/newElectricityStatus",
};
