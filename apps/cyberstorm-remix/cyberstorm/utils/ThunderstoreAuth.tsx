interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  const siteUrl =
    typeof process !== "undefined" &&
    process.env &&
    process.env.PUBLIC_API_URL &&
    typeof process.env.PUBLIC_API_URL === "string"
      ? process.env.PUBLIC_API_URL
      : window &&
        window.ENV &&
        window.ENV.PUBLIC_API_URL &&
        typeof window.ENV.PUBLIC_API_URL === "string"
      ? window.ENV.PUBLIC_API_URL
      : undefined;
  return `${siteUrl}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${siteUrl}/communities/`)}`
  }`;
}
