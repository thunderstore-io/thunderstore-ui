import styles from "./TeamProfile.module.css";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { TextInput } from "../../../../TextInput/TextInput";
import { Team } from "@thunderstore/dapper/types";
import * as Button from "../../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-light-svg-icons";
import { useState } from "react";
import { Icon } from "../../../../Icon/Icon";

export interface TeamProfileProps {
  teamData: Team;
}

export function TeamProfile(props: TeamProfileProps) {
  const { teamData } = props;

  const [donationLink, setDonationLink] = useState(teamData.name);

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Team donation link"
          content={
            <div className={styles.donationLink}>
              <div className={styles.donationLinkLabel}>URL</div>
              <div className={styles.donationLinkActions}>
                <div className={styles.donationLinkTextInput}>
                  <TextInput
                    placeHolder="https://"
                    setValue={setDonationLink}
                    value={donationLink}
                  />
                </div>
                <Button.Root
                  paddingSize="mediumSquare"
                  colorScheme="transparentDanger"
                >
                  <Button.ButtonIcon>
                    <Icon>
                      <FontAwesomeIcon icon={faXmark} />
                    </Icon>
                  </Button.ButtonIcon>
                </Button.Root>
              </div>
            </div>
          }
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
                <Button.Root><Button.ButtonLabel>Upload picture</Button.ButtonLabel></Button.Root>
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
