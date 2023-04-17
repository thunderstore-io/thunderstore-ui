import React from "react";
import styles from "./Account.module.css";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { Button } from "../../../Button/Button";
import { User } from "../../../../schema";
import { TextInput } from "../../../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface AccountProps {
  userData: User;
}

export const Account: React.FC<AccountProps> = (props) => {
  const { userData } = props;
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Delete Account"
          description="Delete your Thunderstore account permanently"
          content={
            <div className={styles.content}>
              <div>
                TODO: this should be an alert. You are about to delete your
                account. Once deleted, it will be gone forever. Please be
                certain.
              </div>
              <p>
                The mods that have been uploaded on this account will remain
                public on the site even after deletion. If you need them to be
                taken down as well, please contact an administrator on the
                community Discord server.
              </p>
              <p>
                As a precaution, to delete your account, please input{" "}
                {userData.name} below
              </p>
              <TextInput placeHolder="Verification" />
              <div>
                <Button
                  leftIcon={<FontAwesomeIcon icon={faTrash} fixedWidth />}
                  colorScheme="danger"
                  label="I understand this action is irrevocable and want to continue"
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

Account.displayName = "Account";
Account.defaultProps = {};
