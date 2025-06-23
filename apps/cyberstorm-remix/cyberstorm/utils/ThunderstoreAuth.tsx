import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  const { PUBLIC_AUTH_BASE_URL, PUBLIC_AUTH_RETURN_URL } =
    getPublicEnvVariables(["PUBLIC_AUTH_BASE_URL", "PUBLIC_AUTH_RETURN_URL"]);
  return `${PUBLIC_AUTH_BASE_URL}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${PUBLIC_AUTH_RETURN_URL}/communities/`)}`
  }`;
}
