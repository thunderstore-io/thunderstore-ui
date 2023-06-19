"use client";
import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamsLink } from "../../Links/Links";
import { Title } from "../../Title/Title";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { SettingItem } from "../../SettingItem/SettingItem";
import { Button } from "../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { getTeamPreviewDummyData } from "../../../dummyData";
import { TeamList } from "./TeamList/TeamList";
import { Dialog } from "../../Dialog/Dialog";
import { TextInput } from "../../TextInput/TextInput";

/**
 * Cyberstorm Teams Layout
 */
export function TeamsLayout() {
  const teamsData = getTeamsData();

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
        </BreadCrumbs>
      }
      header={<Title text="Teams" />}
      mainContent={
        <>
          <SettingItem
            title="Teams"
            description="Manage your teams"
            additionalLeftColumnContent={
              <Dialog
                title="Create Team"
                content={
                  <div className={styles.createTeamDialog}>
                    <div className={styles.createTeamDialogText}>
                      Enter the name of the team you wish to create. Team names
                      can contain the characters a-z A-Z 0-9 _ and must not
                      start or end with an _
                    </div>
                    <TextInput placeHolder="Team name" />
                  </div>
                }
                trigger={
                  <Button
                    label="Create team"
                    rightIcon={<FontAwesomeIcon icon={faPlus} fixedWidth />}
                  />
                }
                acceptButton={<Button label="Create" colorScheme="accent" />}
              />
            }
            content={<TeamList teams={teamsData} />}
          />
        </>
      }
    />
  );
}

TeamsLayout.displayName = "TeamsLayout";

function getTeamsData() {
  return [
    getTeamPreviewDummyData("1"),
    getTeamPreviewDummyData("2"),
    getTeamPreviewDummyData("3"),
    getTeamPreviewDummyData("4"),
  ];
}
