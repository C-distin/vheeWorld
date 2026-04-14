import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth/auth"

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect logged-in users away from auth pages
  if (session && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    if (session.user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard/user", request.url))
  }

  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  if (session?.user.role === "user" && pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL("/dashboard/user", request.url))
  }

  if (session?.user.role === "admin" && pathname.startsWith("/dashboard/user")) {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
}
