import { TeamPreview } from "../../../../schema";
import { DataTable } from "../../../DataTable/DataTable";
import { TeamLink } from "../../../Links/Links";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const teamsMapped = teams?.map((team: TeamPreview) => {
    return [
      <TeamLink team={team.name}>team.name</TeamLink>,
      "",
      team.members?.length,
    ];
  });

  return (
    <DataTable dataRows={teamsMapped} headers={["Name", "Role", "Members"]} />
  );
}

TeamList.displayName = "TeamList";
