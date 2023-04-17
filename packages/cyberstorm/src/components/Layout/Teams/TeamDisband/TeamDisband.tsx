import React from "react";
import styles from "./TeamDisband.module.css";
import { Button } from "../../../Button/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";

export interface TeamDisbandProps {
  teamName?: string;
}

export const TeamDisband: React.FC<TeamDisbandProps> = (props) => {
  const { teamName } = props;

  return (
    <div>
      <SettingItem
        title="Disband Team"
        description="Disband your team completely"
        content={
          <div className={styles.content}>
            <p>You are about to disband the team {teamName}.</p>
            <p>
              Be aware you can currently only disband teams with no packages. If
              you need to archive a team with existing pages, contact
              Mythic#0001 on the Thunderstore Discord.
            </p>
            <p>
              As a precaution, to disband your team, please input {teamName}{" "}
              into the field below.
            </p>
            <TextInput placeHolder="Verification" />
            <div>
              <Button
                colorScheme="danger"
                label="Disband team"
                leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

TeamDisband.displayName = "TeamDisband";
TeamDisband.defaultProps = { teamName: "" };
