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
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { Alert } from "../../Alert/Alert";
import { CreateTeamForm } from "../../Forms/CreateTeamForm/CreateTeamForm";

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
                trigger={
                  <Button.Root colorScheme="primary" paddingSize="large">
                    <Button.ButtonLabel>Create team</Button.ButtonLabel>
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button.ButtonIcon>
                  </Button.Root>
                }
              >
                <CreateTeamForm />
              </Dialog>
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
