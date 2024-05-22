"use client";
import { faSignOut, faUsers } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixDropDown from "@radix-ui/react-dropdown-menu";

import styles from "./Header.module.css";
import { Avatar } from "../Avatar/Avatar";
import { AvatarButton } from "../Avatar/AvatarButton";
import { DropDown, DropDownDivider, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";

interface Props {
  username: string | null;
  avatar?: string | null;
}

export function UserDropDown(props: Props) {
  const { avatar, username } = props;
  return (
    <DropDown
      contentAlignment="end"
      trigger={<AvatarButton src={avatar} username={username} size="small" />}
      content={
        username
          ? [
              <RadixDropDown.Item key="user">
                <div className={styles.dropDownUserInfo}>
                  <Avatar src={avatar} username={username} size="small" />
                  <div className={styles.dropdownUserInfoDetails}>
                    <div className={styles.dropdownUserInfoDetails_userName}>
                      {username}
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
}

UserDropDown.displayName = "UserDropDown";
