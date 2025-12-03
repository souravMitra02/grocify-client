
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const protectedRoutes = ["/dashboard/products", "/dashboard/analytics"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
