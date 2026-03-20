import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";
import { redirect } from "react-router";

interface LoginProps {
  type: "discord" | "github" | "overwolf";
  authBaseDomain: string;
  authReturnDomain: string;
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: LoginProps) {
  return `${props.authBaseDomain}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(
          `${props.authReturnDomain}${props.nextUrl}`
        )}`
      : `?next=${encodeURIComponent(`${props.authReturnDomain}/communities/`)}`
  }`;
}

export function buildLogoutUrl(domain?: string) {
  const publicEnvVariables = getPublicEnvVariables(["VITE_AUTH_RETURN_URL"]);
  const returnURL = publicEnvVariables.VITE_AUTH_RETURN_URL || "";
  const logoutURL = domain ? `${domain}/logout/` : "/logout";
  return `${logoutURL}?next=${encodeURIComponent(returnURL)}`;
}

export function sanitizeReturnUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") && !url.startsWith("//") ? url : undefined;
}

export function redirectToLogin(requestPathname?: string) {
  const rawReturnUrl =
    requestPathname ??
    (typeof window !== "undefined"
      ? window.location.pathname + window.location.search + window.location.hash
      : "");
  const returnUrl = encodeURIComponent(rawReturnUrl);
  return redirect(`/login${returnUrl ? `?returnUrl=${returnUrl}` : ""}`);
}
