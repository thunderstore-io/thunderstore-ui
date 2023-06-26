import { TeamPreview } from "../../../../schema";
import { DataTable } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";
import { ReactElement } from "react";
import { TableColumn } from "react-data-table-component";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const teamData: TeamData[] = [];
  teams?.forEach((team: TeamPreview, index) => {
    teamData.push({
      name: (
        <TeamSettingsLink key={index} team={team.name}>
          {team.name}
        </TeamSettingsLink>
      ),
      nameRaw: team.name.toLowerCase(),
      role: "TODO",
      memberCount: team.members?.length,
    });
  });

  return <DataTable<TeamData> columns={columns} data={teamData} />;
}

TeamList.displayName = "TeamList";

type TeamData = {
  name: ReactElement;
  nameRaw: string;
  role: string;
  memberCount: number;
};

const columns: TableColumn<TeamData>[] = [
  {
    name: "Name",
    style: {
      color: "var(--color-text--default)",
      fontWeight: 700,
    },
    sortable: true,
    cell: (row) => row.name,
    selector: (row) => row.nameRaw,
  },
  {
    name: "role",
    style: {
      color: "var(--color-text--secondary)",
    },
    sortable: true,
    selector: (row) => row.role,
  },
  {
    name: "Members",
    style: {
      color: "var(--color-text--secondary)",
    },
    sortable: true,
    selector: (row) => row.memberCount,
  },
];
