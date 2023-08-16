import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamsLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { SettingItem } from "../../SettingItem/SettingItem";
import { Button } from "../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { TeamList } from "./TeamList/TeamList";
import { Dialog } from "../../Dialog/Dialog";
import { TextInput } from "../../TextInput/TextInput";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import usePromise from "react-promise-suspense";

//TODO: Use Alert component

/**
 * Cyberstorm Teams Layout
 */
export function TeamsLayout() {
  const dapper = useDapper();
  const teamsData = usePromise(dapper.getTeam, []);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Teams" />}
      mainContent={
        <>
          <SettingItem
            title="Teams"
            description="Manage your teams"
            additionalLeftColumnContent={
              <Dialog
                title="Create Team"
                showFooterBorder
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
                    colorScheme="primary"
                    paddingSize="large"
                    label="Create team"
                    rightIcon={<FontAwesomeIcon icon={faPlus} fixedWidth />}
                  />
                }
                cancelButton="default"
                acceptButton={
                  <Button
                    label="Create"
                    paddingSize="large"
                    colorScheme="success"
                  />
                }
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
