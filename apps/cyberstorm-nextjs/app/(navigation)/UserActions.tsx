"use client";
import { faSignOut, faUsers } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import { Avatar } from "@thunderstore/cyberstorm";
import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

export function UserActions() {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <>
      {user.username
        ? [
            <div className={styles.mobileNavAccountPopoverItem} key="user">
              <Avatar src={avatar} username={user.username} size="small" />
              <div className={styles.dropdownUserInfoDetails}>
                <div className={styles.dropdownUserInfoDetails_userName}>
                  {user.username}
                </div>
              </div>
            </div>,
            <a
              href="/logout"
              key="logout"
              className={styles.mobileNavAccountPopoverItem}
            >
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faSignOut} />}
                label="Log Out"
              />
            </a>,
          ]
        : [
            <a
              href="/"
              key="login_link"
              className={styles.mobileNavAccountPopoverItem}
            >
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faUsers} />}
                label="Log in"
              />
            </a>,
          ]}
    </>
  );
}

UserActions.displayName = "UserActions";
