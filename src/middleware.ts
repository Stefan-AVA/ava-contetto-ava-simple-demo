import { NextRequest } from "next/server"

// import secrets from "./constants/secrets"

export default async function middleware(req: NextRequest) {
  // const session = req.cookies.get(secrets.session)
  /**
   * Checks if the user is authenticated.
   */
  // if (!session || (session && !session.value))
  //   return NextResponse.redirect(new URL("/", req.url))
}

export const config = {
  matcher: ["/app/:path*", "/signup/setup"],
}
