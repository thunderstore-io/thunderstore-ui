import styles from "./TeamList.module.css";
import { TeamPreview } from "../../../../schema";
import { TeamLink } from "../../../Links/Links";

export interface TeamListProps {
  teams?: TeamPreview[];
}

export interface TeamListItemProps {
  team: TeamPreview;
  role?: string;
}

//TODO: create and use a generic data list table component

function TeamListItem(props: TeamListItemProps) {
  const { team, role = "" } = props;

  return (
    <TeamLink team={team.name}>
      <div className={styles.listItem}>
        <div className={styles.column}>
          <div className={styles.dataPoint}>{team.name}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.dataPoint}>{role}</div>
        </div>
        <div className={styles.column}>
          <div className={styles.dataPoint}>{team.members?.length}</div>
        </div>
      </div>
    </TeamLink>
  );
}

export function TeamList(props: TeamListProps) {
  const { teams = [] } = props;

  const mappedTeamList = teams?.map((team: TeamPreview, index: number) => {
    return (
      <div key={index}>
        <TeamListItem team={team} />
      </div>
    );
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.column}>
          <div className={styles.dataPoint}>Name</div>
        </div>
        <div className={styles.column}>
          <div className={styles.dataPoint}>Role</div>
        </div>
        <div className={styles.column}>
          <div className={styles.dataPoint}>Members</div>
        </div>
      </div>
      {mappedTeamList}
    </div>
  );
}

TeamList.displayName = "TeamList";
