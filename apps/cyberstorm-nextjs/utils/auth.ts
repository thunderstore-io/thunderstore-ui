import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import hkdf from "@panva/hkdf";
import { EncryptJWT, jwtDecrypt } from "jose";
import { v4 as uuid } from "uuid";
import { isRecord } from "./typeChecks";

interface PartialUserStatus {
  username: string;
  subscription: { expires: string | null };
}

export const AUTH_COOKIE_NAME = "CyberstormAuth";

const now = () => (Date.now() / 1000) | 0;

function isPartialUserStatus(
  userStatus: unknown
): userStatus is PartialUserStatus {
  return (
    isRecord(userStatus) &&
    typeof userStatus.username === "string" &&
    isRecord(userStatus.subscription) &&
    (typeof userStatus.subscription.expires === "string" ||
      typeof userStatus.subscription.expires === null)
  );
}

async function getDerivedEncryptionKey(secret: string | Buffer) {
  return await hkdf(
    "sha256",
    secret,
    "",
    "Cyberstorm Generated Encryption Key",
    32
  );
}

async function encode(token: { username: string; expires: number }) {
  if (process.env.AUTH_SECRET) {
    const encryptionSecret = await getDerivedEncryptionKey(
      process.env.AUTH_SECRET
    );
    return await new EncryptJWT(token)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .setExpirationTime(Math.min(now() + 900, token.expires))
      .setJti(uuid())
      .encrypt(encryptionSecret);
  } else {
    throw new Error("AUTH_SECRET is missing");
  }
}

export async function decode(token: string) {
  if (process.env.AUTH_SECRET) {
    const encryptionSecret = await getDerivedEncryptionKey(
      process.env.AUTH_SECRET
    );
    const { payload } = await jwtDecrypt(token, encryptionSecret, {
      clockTolerance: 15,
    });
    return payload;
  } else {
    throw new Error("AUTH_SECRET is missing");
  }
}

async function fetchSubStatus(sessionid: string | undefined): Promise<{
  username: string | null;
  subActive: boolean;
  expires: number;
}> {
  if (sessionid) {
    const res = await fetch(
      "https://thunderstore.io/api/experimental/current-user/",
      {
        headers: {
          authorization: `Session ${sessionid}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      if (isPartialUserStatus(data)) {
        if (data.subscription.expires) {
          const expiryTimeEpoch = Date.parse(data.subscription.expires);
          if (!Number.isNaN(expiryTimeEpoch) && expiryTimeEpoch > Date.now()) {
            return {
              username: data.username,
              subActive: true,
              expires: expiryTimeEpoch / 1000, // jwtDecrypt Checks the time in seconds format
            };
          }
        }
      }
    }
  }
  return { username: null, subActive: false, expires: 0 };
}

export function redirectToLogin(request: NextRequest, response: NextResponse) {
  if (request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(`${request.nextUrl.origin}/login`);
  }
  return response;
}

export async function handleJWTGenerationAndReturnResponseOrRedirect(
  request: NextRequest,
  response: NextResponse
) {
  if (!request.cookies.get("sessionid")) {
    return redirectToLogin(request, response);
  }

  const subStatus = await fetchSubStatus(
    request.cookies.get("sessionid")?.value
  );
  if (subStatus.username && subStatus.subActive) {
    const newToken = await encode({
      username: subStatus.username,
      expires: subStatus.expires,
    });
    response.cookies.set(AUTH_COOKIE_NAME, newToken);
    return response;
  } else {
    return redirectToLogin(request, response);
  }
}
