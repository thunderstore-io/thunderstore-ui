import { TeamPreview } from "../../../../schema";
import { DataTable, DataTableRows } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const teamData: DataTableRows = [];
  teams?.forEach((team: TeamPreview, index) => {
    teamData.push([
      {
        value: (
          <TeamSettingsLink key={index} team={team.name}>
            {team.name}
          </TeamSettingsLink>
        ),
        sortValue: team.name,
      },
      { value: "TODO", sortValue: 0 },
      { value: team.members?.length, sortValue: team.members?.length },
    ]);
  });

  return <DataTable headers={columns} rows={teamData} />;
}

TeamList.displayName = "TeamList";

const columns = [
  { value: "Name", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Members", disableSort: false },
];
