import { NextResponse, NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';
export { default } from "next-auth/middleware"


export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request });
  console.log("\ntoken\n", token); // remove it

  const isPublic = (
    request.nextUrl.pathname.startsWith("/sign-up") ||
    request.nextUrl.pathname.startsWith("/verify") ||
    request.nextUrl.pathname.startsWith("/sign-in")
  );

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }


  // return NextResponse.next() // remove it

}


export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/verify/:path*"
  ]
}