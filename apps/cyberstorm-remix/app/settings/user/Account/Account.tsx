import { useLoaderData } from "@remix-run/react";
import styles from "./Account.module.css";
import { SettingItem } from "@thunderstore/cyberstorm";
import { DeleteAccountForm } from "@thunderstore/cyberstorm-forms";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { currentUserSchema } from "@thunderstore/dapper-ts";

export async function loader() {
  const dapper = await getDapper();
  const currentUser = await dapper.getCurrentUser();
  return {
    currentUser: currentUser as typeof currentUserSchema._type,
  };
}

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

clientLoader.hydrate = true;

export default function Account() {
  const { currentUser } = useLoaderData<typeof loader | typeof clientLoader>();

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Delete Account"
          description="Delete your Thunderstore account permanently"
          content={<DeleteAccountForm userName={currentUser.username} />}
        />
      </div>
    </div>
  );
}

Account.displayName = "Account";
