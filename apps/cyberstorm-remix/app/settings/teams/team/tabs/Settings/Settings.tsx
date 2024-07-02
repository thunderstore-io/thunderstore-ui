import styles from "./TeamLeaveAndDisband.module.css";
import { SettingItem, Alert, Dialog, Button } from "@thunderstore/cyberstorm";
import { LeaveTeamForm, DisbandTeamForm } from "@thunderstore/cyberstorm-forms";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { ApiError } from "@thunderstore/thunderstore-api";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const dapper = await getDapper();
      const currentUser = await dapper.getCurrentUser();
      return {
        teamName: params.namespaceId,
        currentUser: currentUser as typeof currentUserSchema._type,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    const dapper = await getDapper(true);
    const currentUser = await dapper.getCurrentUser();
    if (!currentUser.username) {
      throw new Response("Not logged in.", { status: 401 });
    }
    try {
      return {
        teamName: params.namespaceId,
        currentUser: currentUser as typeof currentUserSchema._type,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

clientLoader.hydrate = true;

// REMIX TODO: Make sure user is redirected of this page, if the user is not logged in
export default function Settings() {
  const { teamName, currentUser } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  return (
    <div>
      <SettingItem
        title="Leave team"
        description="Leave your team"
        content={
          <div className={styles.content}>
            <Alert
              icon={<FontAwesomeIcon icon={faBomb} />}
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
                  teamName={teamName}
                  username={currentUser.username}
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
              icon={<FontAwesomeIcon icon={faBomb} />}
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
                <DisbandTeamForm teamName={teamName} />
              </Dialog.Root>
            </div>
          </div>
        }
      />
    </div>
  );
}
