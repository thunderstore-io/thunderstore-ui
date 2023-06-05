import styles from "./TeamProfile.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { TextInput } from "../../../../TextInput/TextInput";
import { Team } from "../../../../../schema";

export interface TeamProfileProps {
  teamData: Team;
}

export function TeamProfile(props: TeamProfileProps) {
  const { teamData } = props;

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Team donation link"
          content={<TextInput placeHolder="https://" value={teamData.name} />}
        />
      </div>
    </div>
  );

  /*
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Team Avatar"
          description="Instructions for uploading a picture"
          content={
            <div className={styles.avatarContent}>
              <ModIcon src={teamData.imageSource} />
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
          content={<TextInput placeHolder={teamData.description} />}
        />
        <SettingItem
          title="Abut Us"
          description="A more comprehensive description shown on the profile page"
          content={<TextInput placeHolder={teamData.about} />}
        />

        <div className={styles.line} />

        <div className={styles.section}>
          <SettingItem title="Social Links" content={teamData.name} />
        </div>

        <div className={styles.line} />

        <div className={styles.section}>
          <SettingItem
            title="Team donation link"
            content={<TextInput placeHolder="https://" />}
          />
        </div>
      </div>
    </div>
  );
  */
}

TeamProfile.displayName = "TeamProfile";
