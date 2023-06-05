import styles from "./TeamInfo.module.css";
import { Button } from "../../../Button/Button";
import { Title } from "../../../Title/Title";
import { Avatar } from "../../../Avatar/Avatar";
import { Team } from "../../../../schema";

export interface TeamInfoProps {
  teamData: Team;
}

/**
 * Cyberstorm TeamInfo
 */
export function TeamInfo(props: TeamInfoProps) {
  const { teamData } = props;
  return (
    <div className={styles.root}>
      <Avatar size="large" src={teamData.imageSource} />
      <div className={styles.info}>
        <Title text={teamData.name} />
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{teamData.description}</p>
          <Button
            label="Show more"
            colorScheme="transparentDefault"
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

TeamInfo.displayName = "TeamInfo";
