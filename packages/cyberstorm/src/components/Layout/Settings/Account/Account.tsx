import styles from "./Account.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import * as Button from "../../../Button/";
import { UserSettings } from "@thunderstore/dapper/types";
import { TextInput } from "../../../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faWarning } from "@fortawesome/pro-solid-svg-icons";
import { Alert, Icon } from "../../../..";

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
                icon={
                  <Icon>
                    <FontAwesomeIcon icon={faWarning} />
                  </Icon>
                }
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
                <Button.Root colorScheme="danger" paddingSize="large">
                  <Button.Icon>
                    <Icon>
                      <FontAwesomeIcon icon={faTrash} />
                    </Icon>
                  </Button.Icon>
                  <Button.Label>
                    I understand this action is irrevocable and want to continue
                  </Button.Label>
                </Button.Root>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

Account.displayName = "Account";
