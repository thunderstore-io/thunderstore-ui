import { BetaLoginLayout } from "@thunderstore/cyberstorm";
import { getPublicAuthConfig } from "@/config";

export default function Page() {
  return <BetaLoginLayout {...getPublicAuthConfig()} />;
}
