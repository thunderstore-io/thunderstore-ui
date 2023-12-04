import styles from "./TeamLeaveAndDisband.module.css";
import * as Button from "../../../../Button/";
import { SettingItem } from "../../../../SettingItem/SettingItem";
import { Alert, Dialog } from "../../../../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faOctagonExclamation,
  faTrashCan,
} from "@fortawesome/pro-solid-svg-icons";
import { DisbandTeamForm } from "@thunderstore/cyberstorm-forms";
import { LeaveTeamForm } from "@thunderstore/cyberstorm-forms";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { useState } from "react";

interface Props {
  teamName: string;
}

export function TeamLeaveAndDisband(props: Props) {
  const { teamName } = props;
  const [disbandTeamDialogOpen, setDisbandTeamDialogOpen] = useState(false);
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  // TODO: Make sure user is redirected of this page, if the user is not logged in
  const userName = user.username ? user.username : "";
  const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);

  return (
    <div>
      <SettingItem
        title="Leave team"
        description="Leave your team"
        content={
          <div className={styles.content}>
            <Alert
              icon={<FontAwesomeIcon icon={faOctagonExclamation} />}
              content={
                "You cannot currently leave this team as you are it's last owner."
              }
              variant="danger"
            />
            <p className={styles.description}>
              If you are the owner of the team, you can only leave if the team
              has another owner assigned.
            </p>
            <div>
              <Dialog.Root
                open={leaveTeamDialogOpen}
                onOpenChange={setLeaveTeamDialogOpen}
                title="Confirm leaving the team"
                trigger={
                  <Button.Root colorScheme="danger" paddingSize="large">
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>Leave team</Button.ButtonLabel>
                  </Button.Root>
                }
              >
                <LeaveTeamForm
                  dialogOnChange={setLeaveTeamDialogOpen}
                  teamName={teamName}
                  userName={userName}
                />
              </Dialog.Root>
            </div>
          </div>
        }
      />
      <div className={styles.separator} />
      <SettingItem
        title="Disband Team"
        description="Disband your team completely"
        content={
          <div className={styles.content}>
            <Alert
              icon={<FontAwesomeIcon icon={faOctagonExclamation} />}
              content={
                "You cannot currently disband this team as it has packages."
              }
              variant="danger"
            />
            <p className={styles.description}>
              You are about to disband the team {teamName}.
            </p>
            <p className={styles.description}>
              Be aware you can currently only disband teams with no packages. If
              you need to archive a team with existing pages, contact
              Mythic#0001 on the Thunderstore Discord.
            </p>
            <div>
              <Dialog.Root
                open={disbandTeamDialogOpen}
                onOpenChange={setDisbandTeamDialogOpen}
                title="Confirm team disband"
                trigger={
                  <Button.Root colorScheme="danger" paddingSize="large">
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button.ButtonIcon>
                    <Button.ButtonLabel>Disband team</Button.ButtonLabel>
                  </Button.Root>
                }
              >
                <DisbandTeamForm
                  dialogOnChange={setDisbandTeamDialogOpen}
                  teamName={teamName}
                />
              </Dialog.Root>
            </div>
          </div>
        }
      />
    </div>
  );
}

TeamLeaveAndDisband.displayName = "TeamLeaveAndDisband";
