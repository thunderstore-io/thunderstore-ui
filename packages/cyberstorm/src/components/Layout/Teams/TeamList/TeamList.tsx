import { TeamPreview } from "../../../../schema";
import { DataTable } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const teamsMapped = teams?.map((team: TeamPreview, index) => {
    return [
      <TeamSettingsLink key={index} team={team.name}>
        {team.name}
      </TeamSettingsLink>,
      "",
      team.members?.length,
    ];
  });

  return (
    <DataTable dataRows={teamsMapped} headers={["Name", "Role", "Members"]} />
  );
}

TeamList.displayName = "TeamList";
