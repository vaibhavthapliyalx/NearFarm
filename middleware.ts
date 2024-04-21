import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./shared/constants";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicRoutes = ["/", "/products", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const protectedRoutes = [new RegExp("^/profile(/.+)?$"), "/orders(/.+)?$", "/dashboard"];
  if (protectedRoutes.some(route => route instanceof RegExp ? route.test(pathname) : route === pathname) && !token) {
    return NextResponse.redirect(new URL("/login?error=You need to login to access this page", req.url));
  }

  // If user is already onboarded and tries to access onboarding page, redirect to dashboard.
  if (token && token.isOnBoarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const SellerOnlyRoutes = [
    "/dashboard", 
    new RegExp("^/listings(/.+)?$"), 
    new RegExp("^/orders(/.+)?$")
  ];

  // Check if the pathname starts with any of the SellerOnlyRoutes
  const isSellerOnlyRoute = SellerOnlyRoutes.some(route => route instanceof RegExp ? route.test(pathname) : route === pathname);

  if (token && token.role === UserRole.FARMER && isSellerOnlyRoute) {
    return NextResponse.next();
  }

  // If the user is a consumer and tries to access farmer routes, redirect to login page with error message.
  if (token && token.role === UserRole.CONSUMER && isSellerOnlyRoute) {
    return NextResponse.redirect(new URL("/login?error=Please register or login using account that has seller privilages", req.url));
  }

  // If user is not authenticated, and tries to access protected routes, redirect to login page.
  if (!token && isSellerOnlyRoute) {
    return NextResponse.redirect(new URL("/login?error=You need to login to access this page", req.url));
  }
}