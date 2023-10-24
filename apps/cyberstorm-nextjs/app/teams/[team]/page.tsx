import { TeamSettingsLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamSettingsLayout teamName={params.team} />;
}
