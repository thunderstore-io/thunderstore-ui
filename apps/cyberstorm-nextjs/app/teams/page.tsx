"use client";
import styles from "./TeamsLayout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus } from "@fortawesome/pro-solid-svg-icons";
import { CreateTeamForm } from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import { Alert, Button, Dialog } from "@thunderstore/cyberstorm";
import { SettingItem } from "@thunderstore/cyberstorm/src/components/SettingItem/SettingItem";
import { TeamList } from "@thunderstore/cyberstorm/src/components/Layout/Teams/TeamList/TeamList";

export default function Page() {
  const [dialogOpen, setOpenDialog] = useState(false);

  return (
    <SettingItem
      title="Teams"
      description="Manage your teams"
      additionalLeftColumnContent={
        <Dialog.Root
          open={dialogOpen}
          onOpenChange={setOpenDialog}
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
          <CreateTeamForm dialogOnChange={setOpenDialog} />
        </Dialog.Root>
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
  );
}
