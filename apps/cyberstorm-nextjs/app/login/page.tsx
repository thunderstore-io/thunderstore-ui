import { BetaLoginLayout } from "@thunderstore/cyberstorm";

export default function Page() {
  return (
    <BetaLoginLayout
      discordAuthUrl={`${process.env.CYBERSTORM_AUTH_BASE_URL}${process.env.CYBERSTORM_AUTH_DISCORD_URL}`}
      githubAuthUrl={`${process.env.CYBERSTORM_AUTH_BASE_URL}${process.env.CYBERSTORM_AUTH_GITHUB_URL}`}
      overwolfAuthUrl={`${process.env.CYBERSTORM_AUTH_BASE_URL}${process.env.CYBERSTORM_AUTH_OVERWOLF_URL}`}
    />
  );
}
