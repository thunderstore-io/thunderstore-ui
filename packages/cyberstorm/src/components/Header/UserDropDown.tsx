"use client";
import { faSignOut, faUser, faUsers } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixDropDown from "@radix-ui/react-dropdown-menu";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import styles from "./Header.module.css";
import { Avatar } from "../Avatar/Avatar";
import { AvatarButton } from "../Avatar/AvatarButton";
import * as Button from "../Button/";
import { DropDown, DropDownDivider, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";

export const UserDropDown = () => {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <DropDown
      contentAlignment="end"
      trigger={
        avatar && user.username ? (
          <AvatarButton src={avatar} username={user.username} size="small" />
        ) : (
          <Button.Root>
            <Button.ButtonIcon>
              <FontAwesomeIcon icon={faUser} />
            </Button.ButtonIcon>
          </Button.Root>
        )
      }
      content={
        user.username
          ? [
              <RadixDropDown.Item key="user">
                <div className={styles.dropDownUserInfo}>
                  <Avatar src={avatar} username={user.username} size="small" />
                  <div className={styles.dropdownUserInfoDetails}>
                    <div className={styles.dropdownUserInfoDetails_userName}>
                      {user.username}
                    </div>
                  </div>
                </div>
              </RadixDropDown.Item>,

              <DropDownDivider key="divider-first" />,

              <a href="/logout" key="logout">
                <DropDownItem
                  content={
                    <DropDownLink
                      leftIcon={<FontAwesomeIcon icon={faSignOut} />}
                      label="Log Out"
                    />
                  }
                />
              </a>,
            ]
          : [
              <a href="/" key="login_link">
                <DropDownItem
                  content={
                    <DropDownLink
                      leftIcon={<FontAwesomeIcon icon={faUsers} />}
                      label="Log in"
                    />
                  }
                />
              </a>,
            ]
      }
    />
  );
};

UserDropDown.displayName = "UserDropDown";
