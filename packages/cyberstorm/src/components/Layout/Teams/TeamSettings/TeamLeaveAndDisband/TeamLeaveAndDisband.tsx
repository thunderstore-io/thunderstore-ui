import styles from "./TeamLeaveAndDisband.module.css";
import { Button } from "../../../../Button/Button";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { TeamSettings } from "../../../../../schema";
import { TextInput } from "../../../../TextInput/TextInput";

export interface TeamLeaveAndDisbandProps {
  teamData: TeamSettings;
}

export function TeamLeaveAndDisband(props: TeamLeaveAndDisbandProps) {
  const { teamData } = props;

  return (
    <div>
      <SettingItem
        title="Leave team"
        description="Leave your team"
        content={
          <div className={styles.content}>
            TODO: Alert
            <p
              className={styles.description}
            >{`You are about to leave the team ${teamData.name}`}</p>
            <p className={styles.description}>
              If you are the owner of the team, you can only leave if the team
              has another owner assigned.
            </p>
            <div>
              <Button
                colorScheme="danger"
                label="Leave team"
                paddingSize="large"
              />
            </div>
          </div>
        }
      />
      <div className={styles.separator} />
      <SettingItem
        title="Disband Team"
        description="Disband your team completely"
        content={
          <div className={styles.content}>
            TODO: Alert
            <p className={styles.description}>
              You are about to disband the team {teamData.name}.
            </p>
            <p className={styles.description}>
              Be aware you can currently only disband teams with no packages. If
              you need to archive a team with existing pages, contact
              Mythic#0001 on the Thunderstore Discord.
            </p>
            <p className={styles.description}>
              As a precaution, to disband your team, please input{" "}
              {teamData.name} into the field below.
            </p>
            <div className={styles.disbandVerificationInput}>
              <TextInput placeHolder="Verification" />
            </div>
            <div>
              <Button
                colorScheme="danger"
                label="Disband team"
                paddingSize="large"
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

TeamLeaveAndDisband.displayName = "TeamLeaveAndDisband";
