import styles from "./Account.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { DeleteAccountForm } from "@thunderstore/cyberstorm-forms";

export interface AccountProps {
  username: string | null;
}

export function Account(props: AccountProps) {
  const { username } = props;

  // Username is null for unauthenticated users, but since this view is
  // for an authenticated user, this should never happen.
  if (username === null) {
    throw new Error("Account component requires username");
  }

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Delete Account"
          description="Delete your Thunderstore account permanently"
          content={<DeleteAccountForm userName={username} />}
        />
      </div>
    </div>
  );
}

Account.displayName = "Account";
