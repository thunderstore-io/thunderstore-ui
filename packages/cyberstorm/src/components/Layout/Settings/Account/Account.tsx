import styles from "./Account.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Button } from "../../../Button/Button";
import { UserSettings } from "@thunderstore/dapper/src/schema";
import { TextInput } from "../../../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faWarning } from "@fortawesome/pro-solid-svg-icons";
import { Alert } from "../../../..";

export interface AccountProps {
  userData: UserSettings;
}

export function Account(props: AccountProps) {
  const { userData } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Delete Account"
          description="Delete your Thunderstore account permanently"
          content={
            <div className={styles.content}>
              <Alert
                icon={<FontAwesomeIcon fixedWidth icon={faWarning} />}
                content={
                  "You are about to delete your account. Once deleted, it will be gone forever. Please be certain."
                }
                variant="warning"
              />
              <p className={styles.instructionText}>
                The mods that have been uploaded on this account will remain
                public on the site even after deletion. If you need them to be
                taken down as well, please contact an administrator on the
                community Discord server.
              </p>
              <p>
                As a precaution, to delete your account, please input{" "}
                <i>{userData.name}</i> to the field below
              </p>
              <div className={styles.verificationInput}>
                <TextInput placeHolder="Verification..." />
              </div>
              <div>
                <Button
                  leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
                  colorScheme="danger"
                  paddingSize="large"
                  label="I understand this action is irrevocable and want to continue"
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

Account.displayName = "Account";
