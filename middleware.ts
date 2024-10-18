// ./middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from 'pocketbase';
import PocketBase from 'pocketbase';
import { initPocketBaseFromRequest } from './app/lib/pb';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function middleware(request: NextRequest) {
  const pb = await initPocketBaseFromRequest(request);
  
  if (!pb.authStore.isValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.png|login).*)'],
}