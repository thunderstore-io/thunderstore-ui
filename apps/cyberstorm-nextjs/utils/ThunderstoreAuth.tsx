"use client";

import { getPublicSiteUrl } from "@/config";

interface Props {
  type: "discord" | "github" | "overwolf";
  nextUrl?: string;
}

export function buildAuthLoginUrl(props: Props) {
  const siteURL = getPublicSiteUrl();
  return `${siteURL}/auth/login/${props.type}/${
    props.nextUrl
      ? `?next=${encodeURIComponent(props.nextUrl)}`
      : `?next=${encodeURIComponent(`${siteURL}/communities/`)}`
  }`;
}
