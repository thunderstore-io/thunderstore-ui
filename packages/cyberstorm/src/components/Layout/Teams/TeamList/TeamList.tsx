import { Team } from "@thunderstore/dapper/types";
import { DataTable, DataTableRows } from "../../../DataTable/DataTable";
import { TeamSettingsLink } from "../../../Links/Links";
import styles from "./TeamList.module.css";
import { Alert } from "../../../..";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface TeamListProps {
  teams?: Team[];
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;
  const createdTeamName = "Dapper Provider Team";

  const teamData: DataTableRows = [];
  teams?.forEach((team, index) => {
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
        value: "TODO ADD USER ROLE",
        sortValue: 0,
      },
      {
        value: team.members?.length,
        sortValue: team.members?.length,
      },
    ]);
  });

  return (
    <div className={styles.content}>
      <Alert
        icon={<FontAwesomeIcon fixedWidth icon={faCircleCheck} />}
        content={
          <span>
            New team
            <span className={styles.boldText}> {createdTeamName}</span> created
          </span>
        }
        variant="success"
      />
      <DataTable headers={columns} rows={teamData} />
    </div>
  );
}

TeamList.displayName = "TeamList";

const columns = [
  { value: "Team Name", disableSort: false },
  { value: "Role", disableSort: false },
  { value: "Members", disableSort: false },
];
