interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  return `${import.meta.env.VITE_AUTH_BASE_URL}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(
          `${import.meta.env.VITE_AUTH_RETURN_URL}/communities/`
        )}`
  }`;
}
