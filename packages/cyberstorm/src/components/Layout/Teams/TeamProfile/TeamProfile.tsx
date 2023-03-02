import React from "react";
import styles from "./TeamProfile.module.css";
import { Button } from "../../../Button/Button";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { ModIcon } from "../../../ModIcon/ModIcon";
import { TextInput } from "../../../TextInput/TextInput";

export interface TeamProfileProps {
  teamName?: string;
}

export const TeamProfile: React.FC<TeamProfileProps> = (props) => {
  const { teamName } = props;

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Team Avatar"
          description="Instructions for uploading a picture"
          content={
            <div className={styles.avatarContent}>
              <ModIcon />
              <div>
                <Button label="Upload picture" />
              </div>
            </div>
          }
        />
      </div>

      <div className={styles.line} />

      <div className={styles.section}>
        <SettingItem
          title="Profile Summary"
          description="A short description shown in header and profile cards"
          content={<TextInput />}
        />
        <SettingItem
          title="Abut Us"
          description="A more comprehensive description shown on the profile page"
          content={<TextInput />}
        />

        <div className={styles.line} />

        <div className={styles.section}>
          <SettingItem title="Social Links" content={teamName} />
        </div>
      </div>
    </div>
  );
};

TeamProfile.displayName = "TeamProfile";
TeamProfile.defaultProps = { teamName: "" };
