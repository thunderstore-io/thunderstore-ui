import { TeamLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamLayout teamId={params.team} />;
}
