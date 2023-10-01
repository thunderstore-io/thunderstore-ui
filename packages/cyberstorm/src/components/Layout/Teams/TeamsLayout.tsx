import styles from "./TeamsLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { TeamsLink } from "../../Links/Links";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { SettingItem } from "../../SettingItem/SettingItem";
import * as Button from "../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { TeamList } from "./TeamList/TeamList";
import { Dialog } from "../../Dialog/Dialog";
import { TextInput } from "../../TextInput/TextInput";
import { PageHeader } from "../BaseLayout/PageHeader/PageHeader";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { Icon } from "../../Icon/Icon";

//TODO: Use Alert component

/**
 * Cyberstorm Teams Layout
 */
export function TeamsLayout() {
  const dapper = useDapper();
  const teamsData = usePromise(dapper.getTeamList, []);

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
                    <Button.Label>Create team</Button.Label>
                    <Button.Icon>
                      <Icon>
                        <FontAwesomeIcon icon={faPlus} />
                      </Icon>
                    </Button.Icon>
                  </Button.Root>
                }
                cancelButton="default"
                acceptButton={
                  <Button.Root paddingSize="large" colorScheme="success">
                    <Button.Label>Create</Button.Label>
                  </Button.Root>
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
