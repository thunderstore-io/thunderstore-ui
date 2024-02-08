import { TeamDetailsEdit } from "@thunderstore/cyberstorm-forms";

export default function Page(props: { params: { team: string } }) {
  return <TeamDetailsEdit teamName={props.params.team} />;
}
