import type { NextApiRequest, NextApiResponse } from "next";

import { getJsonPostSettings } from "utils/fetch";
import { isProvider, OAuthManager } from "utils/oauth";

interface SuccessResponse {
  ok: true;
  sessionId: string;
}

interface ErrorResponse {
  ok: false;
  error: string;
}

export type AuthCompleteResponse = SuccessResponse | ErrorResponse;

/**
 * Relay OAuth request from client to Django backend. Request is
 * augmented with a secret token that's not available on client-side.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthCompleteResponse>
): Promise<void> {
  if (req.method !== "POST") {
    res.status(400).json({ ok: false, error: "Only POST is supported" });
    return;
  }

  const { code, provider } = req.body;

  if (typeof code !== "string" || typeof provider !== "string") {
    res.status(400).json({ ok: false, error: "Invalid parameters" });
    return;
  }

  if (!isProvider(provider)) {
    res.status(400).json({ ok: false, error: "Unsupported provider" });
    return;
  }

  const secret = process.env.OAUTH_SHARED_SECRET;

  if (!secret) {
    res.status(500).json({ ok: false, error: "Invalid server configuration" });
    return;
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}experimental/auth/complete/${provider}/`;
  const redirectUri = OAuthManager.getLocalRedirectUri(provider);
  const payload = { code, redirect_uri: redirectUri };
  const settings = getJsonPostSettings(payload);
  settings.headers = {
    ...(settings.headers || {}),
    authorization: `TS-Secret ${secret}`,
  };
  const response = await fetch(apiUrl, settings);

  if (!response.ok) {
    const error = await response.text();
    res.status(response.status).json({ ok: false, error });
    return;
  }

  const data = await response.json();
  res.status(200).json({ ok: true, sessionId: data.session_id });
}
