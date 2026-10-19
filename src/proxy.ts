import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { IJosePayloadType } from "./interfaces/jose-type";
import { UserRole } from "./interfaces/user-type";
import { getDefaultDashboardRoute } from "./utils/get-dashboard-route";
import { getRouteOwner, isAuthRoute } from "./utils/route-handler";
import { deleteCookie, getCookie } from "./utils/token-handler";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = (await getCookie("access-token")) || null;

  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) throw new Error("Missing ACCESS_TOKEN_SECRET");

      const { payload } = await jose.jwtVerify<IJosePayloadType>(
        accessToken,
        new TextEncoder().encode(secret),
      );

      userRole = payload.role;
    } catch {
      await deleteCookie("access-token");
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Redirect logged-in users away from auth pages (signin, signup, etc.)
  if (isAuth && accessToken) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
    );
  }

  if (routeOwner === "COMMON") {
    if (!accessToken) {
      const logInUrl = new URL("/signin", request.url);
      logInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(logInUrl);
    }
    return NextResponse.next();
  }

  // redirect to signin if user is not logged in and trying to access protected routes
  if (!accessToken && routeOwner !== null) {
    const logInUrl = new URL("/signin", request.url);
    logInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(logInUrl);
  }

  // redirect to signin if user is logged in but trying to access a route not allowed for their role
  if (accessToken && routeOwner !== null && userRole !== routeOwner) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|images|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
