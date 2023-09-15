import { BetaLoginLayout } from "@thunderstore/cyberstorm";

export default function Page() {
  return (
    <BetaLoginLayout
      discordAuthUrl={`${process.env.NEXT_PUBLIC_AUTH_DISCORD_URL}${process.env.NEXT_PUBLIC_AUTH_RETURN_URL}`}
      githubAuthUrl={`${process.env.NEXT_PUBLIC_AUTH_GITHUB_URL}${process.env.NEXT_PUBLIC_AUTH_RETURN_URL}`}
      overwolfAuthUrl={`${process.env.NEXT_PUBLIC_AUTH_OVERWOLF_URL}${process.env.NEXT_PUBLIC_AUTH_RETURN_URL}`}
    />
  );
}
