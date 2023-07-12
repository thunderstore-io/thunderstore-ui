import { TeamPreview } from "../../../../schema";
import { DataTable, DataTableRows } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";
import styles from "./TeamList.module.css";

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
            <span className={styles.nameColumn}>{team.name}</span>
          </TeamSettingsLink>
        ),
        sortValue: team.name,
      },
      {
        value: <span className={styles.otherColumns}>TODO ADD USER ROLE</span>,
        sortValue: 0,
      },
      {
        value: (
          <span className={styles.otherColumns}>{team.members?.length}</span>
        ),
        sortValue: team.members?.length,
      },
    ]);
  });

  return <DataTable headers={columns} rows={teamData} />;
}

TeamList.displayName = "TeamList";

const columns = [
  { value: "Team Name", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Members", disableSort: false },
];
