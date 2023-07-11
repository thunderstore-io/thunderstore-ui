import { TeamPreview } from "../../../../schema";
import { DataTable } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";
import { ReactNode } from "react";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const teamData: ReactNode[][] = [];
  teams?.forEach((team: TeamPreview, index) => {
    teamData.push([
      <TeamSettingsLink key={index} team={team.name}>
        {team.name}
      </TeamSettingsLink>,
      "TODO",
      team.members?.length,
    ]);
  });

  return <DataTable headers={columns} rows={teamData} />;
}

TeamList.displayName = "TeamList";

const columns = ["Name", "Role", "Members"];
