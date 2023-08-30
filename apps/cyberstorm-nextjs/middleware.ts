import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  decode,
  handleJWTGenerationAndReturnResponseOrRedirect,
  redirectToLogin,
} from "./utils/auth";
import { errors } from "jose";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const req = request;
  const response = NextResponse.next();

  // For the sake of keeping dev configuration easy and not confusing
  if (!process.env.CYBERSTORM_AUTH_ENABLED) {
    return response;
  }

  const JWTToken = request.cookies.get(AUTH_COOKIE_NAME);
  if (JWTToken) {
    try {
      await decode(JWTToken.value);
    } catch (e) {
      if (e instanceof errors.JWTExpired) {
        return handleJWTGenerationAndReturnResponseOrRedirect(req, response);
      }
      if (e instanceof errors.JWEDecryptionFailed) {
        return new NextResponse(null, { status: 400 });
      }
      if (e instanceof errors.JWSSignatureVerificationFailed) {
        return new NextResponse(null, { status: 403 });
      }
      return new NextResponse(null, { status: 500 });
    }
    return response;
  } else {
    if (request.cookies.get("sessionid")) {
      return handleJWTGenerationAndReturnResponseOrRedirect(req, response);
    } else {
      return redirectToLogin(request, response);
    }
  }
}
