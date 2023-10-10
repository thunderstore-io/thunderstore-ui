import { TeamProfileLayout } from "@thunderstore/cyberstorm";

export default function Page({ params }: { params: { team: string } }) {
  return <TeamProfileLayout teamName={params.team} />;
}
