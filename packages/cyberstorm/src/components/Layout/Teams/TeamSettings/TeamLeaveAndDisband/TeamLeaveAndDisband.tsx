import styles from "./TeamLeaveAndDisband.module.css";
import * as Button from "../../../../Button/";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Team } from "@thunderstore/dapper/types";
import { TextInput } from "../../../../TextInput/TextInput";
import { Alert, Icon } from "../../../../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faOctagonExclamation } from "@fortawesome/pro-solid-svg-icons";

export interface TeamLeaveAndDisbandProps {
  teamData: Team;
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
            <Alert
              icon={
                <Icon>
                  <FontAwesomeIcon icon={faOctagonExclamation} />
                </Icon>
              }
              content={
                "You cannot currently leave this team as you are it’s last owner."
              }
              variant="danger"
            />
            <p
              className={styles.description}
            >{`You are about to leave the team ${teamData.name}`}</p>
            <p className={styles.description}>
              If you are the owner of the team, you can only leave if the team
              has another owner assigned.
            </p>
            <div>
              <Button.Root variant="danger" paddingSize="large">
                <Button.ButtonLabel>Leave team</Button.ButtonLabel>
              </Button.Root>
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
            <Alert
              icon={
                <Icon>
                  <FontAwesomeIcon icon={faOctagonExclamation} />
                </Icon>
              }
              content={
                "You cannot currently disband this team as it has packages."
              }
              variant="danger"
            />
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
              <Button.Root variant="danger" paddingSize="large">
                <Button.ButtonLabel>Disband team</Button.ButtonLabel>
              </Button.Root>
            </div>
          </div>
        }
      />
    </div>
  );
}

TeamLeaveAndDisband.displayName = "TeamLeaveAndDisband";
