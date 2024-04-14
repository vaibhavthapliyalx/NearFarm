import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./shared/constants";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
      return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const consumerRoutes = ["/cart", "/checkout", "/profile", "/orders"];
  const farmerRoutes = ["/profile", "/add-product"];

  if (token === null && consumerRoutes.includes(pathname) || farmerRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login?error=You need to be logged in to access this page",req.url));
  }

  // Get role from token.
  const role = token?.role;

  // If the user is a consumer and tries to access farmer routes, redirect to home page.
  if (role === UserRole.CONSUMER && farmerRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is a farmer and tries to access consumer routes, redirect to home page.
  if (role === UserRole.FARMER && consumerRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
  }
}