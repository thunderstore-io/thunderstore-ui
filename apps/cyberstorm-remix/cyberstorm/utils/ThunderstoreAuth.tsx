interface Props {
  type: "discord" | "github" | "overwolf";
  authBaseDomain: string;
  authReturnDomain: string;
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  return `${props.authBaseDomain}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${props.authReturnDomain}/communities/`)}`
  }`;
}
