import { TeamProfileLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamProfileLayout teamId={params.team} />;
}
