import styles from "./Connections.module.css";
import { SettingItem } from "@thunderstore/cyberstorm";
import { CyberstormLink } from "@thunderstore/cyberstorm/src/components/Links/Links";

import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { useLoaderData } from "@remix-run/react";
import { UserConnectionsForm } from "@thunderstore/cyberstorm-forms";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";

// REMIX TODO: Add check for "user has permission to see this page"
export async function clientLoader() {
  const dapper = await getDapper(true);
  const currentUser = await dapper.getCurrentUser();
  if (!currentUser.username) {
    throw new Response("Not logged in.", { status: 401 });
  }
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
  };
}

export function HydrateFallback() {
  return "Loading...";
}

export default function Connections() {
  const { currentUser } = useLoaderData<typeof clientLoader>();

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Connections"
          description={
            <>
              This information will not be shared outside of Thunderstore. Read
              more on our{" "}
              <span className={styles.privacyPolicyLink}>
                <CyberstormLink linkId="PrivacyPolicy">
                  Privacy Policy
                </CyberstormLink>
              </span>
              .
            </>
          }
          content={
            <UserConnectionsForm
              currentUser={currentUser}
              connectionLinks={{
                discord: buildAuthLoginUrl({ type: "discord" }),
                github: buildAuthLoginUrl({ type: "github" }),
                overwolf: buildAuthLoginUrl({ type: "overwolf" }),
              }}
            />
          }
        />
      </div>
    </div>
  );
}

Connections.displayName = "Connections";
