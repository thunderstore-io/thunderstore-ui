interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  let domain: string;
  let returnDomain: string;
  if (import.meta.env.SSR) {
    domain = process.env.VITE_SITE_URL || "";
    returnDomain = process.env.VITE_AUTH_RETURN_URL || "";
  } else {
    domain = import.meta.env.VITE_SITE_URL;
    returnDomain = import.meta.env.VITE_AUTH_RETURN_URL;
  }

  return `${domain}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${returnDomain}/communities/`)}`
  }`;
}
