import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/app/:path*"];

export default function middleware(req: NextRequest) {
	if (!false && protectedRoutes.includes(req.nextUrl.pathname)) {
		const absoluteURL = new URL("/", req.nextUrl.origin);
		return NextResponse.redirect(absoluteURL.toString());
	}
}
