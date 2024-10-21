// ./middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { initPocketBaseFromRequest } from "./app/lib/pb";


export async function middleware(request: NextRequest) {
  const pb = await initPocketBaseFromRequest(request);

  if (!pb.authStore.isValid && request.nextUrl.pathname.includes("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.png|login).*)"],
};
