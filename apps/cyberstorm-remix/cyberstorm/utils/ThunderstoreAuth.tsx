import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  const envVars = getPublicEnvVariables(["PUBLIC_AUTH_URL", "PUBLIC_API_URL"]);
  return `${envVars.PUBLIC_AUTH_URL}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${envVars.PUBLIC_API_URL}/communities/`)}`
  }`;
}
