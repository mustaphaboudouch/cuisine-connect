import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyJWT } from "@/lib/auth";
import {
  isPrivateApiRoute,
  isPrivateRoute,
  isPublicApiRoute,
  isPublicRoute,
} from "@/lib/url";

export async function middleware(req: NextRequest) {
  let token: string | undefined;

  if (req.cookies.has("token")) {
    token = req.cookies.get(process.env.JWT_TOKEN_NAME!)?.value;
  }

  if (!token) {
    if (isPrivateRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (isPrivateApiRoute(req.nextUrl.pathname)) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  const response = NextResponse.next();
  let isAuthenticated = false;

  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      response.headers.set("X-USER-ID", sub);
      isAuthenticated = true;
    }
  } catch (error) {
    if (isPrivateRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (isPrivateApiRoute(req.nextUrl.pathname)) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  if (isAuthenticated) {
    if (isPublicRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/recipes", req.url));
    }
    if (isPublicApiRoute(req.nextUrl.pathname)) {
      return new Response("Not allowed", { status: 403 });
    }
  }

  if (!isAuthenticated) {
    if (isPrivateRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (isPrivateApiRoute(req.nextUrl.pathname)) {
      return new Response("Unauthorized", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
