import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamsLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { SettingItem } from "../../SettingItem/SettingItem";
import * as Button from "../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus } from "@fortawesome/pro-solid-svg-icons";
import { TeamList } from "./TeamList/TeamList";
import { Dialog } from "../../Dialog/Dialog";
import { TextInput } from "../../TextInput/TextInput";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { Alert } from "../../Alert/Alert";

/**
 * View for listing and managing authenticated user's teams.
 */
export function TeamsLayout() {
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
                  <Button.Root colorScheme="primary" paddingSize="large">
                    <Button.ButtonLabel>Create team</Button.ButtonLabel>
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button.ButtonIcon>
                  </Button.Root>
                }
                cancelButton="default"
                acceptButton={
                  <Button.Root paddingSize="large" colorScheme="success">
                    <Button.ButtonLabel>Create</Button.ButtonLabel>
                  </Button.Root>
                }
              />
            }
            content={
              <div className={styles.contentWrapper}>
                <Alert
                  icon={<FontAwesomeIcon icon={faCircleCheck} />}
                  content={
                    <span>
                      New team
                      <span className={styles.boldText}> TODO</span> created
                    </span>
                  }
                  variant="success"
                />
                <TeamList />
              </div>
            }
          />
        </>
      }
    />
  );
}

TeamsLayout.displayName = "TeamsLayout";
