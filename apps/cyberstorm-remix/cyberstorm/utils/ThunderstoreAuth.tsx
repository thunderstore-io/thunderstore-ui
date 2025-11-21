import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

interface LoginProps {
  type: "discord" | "github" | "overwolf";
  authBaseDomain: string;
  authReturnDomain: string;
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: LoginProps) {
  return `${props.authBaseDomain}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${props.authReturnDomain}/communities/`)}`
  }`;
}

export function buildLogoutUrl(domain?: string) {
  const publicEnvVariables = getPublicEnvVariables(["VITE_AUTH_RETURN_URL"]);
  const returnURL = publicEnvVariables.VITE_AUTH_RETURN_URL || "";
  const logoutURL = domain ? `${domain}/logout/` : "/logout";
  return `${logoutURL}?next=${encodeURIComponent(returnURL)}`;
}
