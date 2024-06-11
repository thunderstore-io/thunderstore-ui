import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  const PUBLIC_API_URL = getPublicEnvVariables([
    "PUBLIC_API_URL",
  ]).PUBLIC_API_URL;
  return `${PUBLIC_API_URL}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${PUBLIC_API_URL}/communities/`)}`
  }`;
}
