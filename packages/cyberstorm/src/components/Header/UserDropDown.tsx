"use client";
import {
  faCog,
  faCreditCard,
  faSignOut,
  faUser,
  faUsers,
} from "@fortawesome/pro-solid-svg-icons";
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
import { SettingsLink, TeamsLink, UserLink } from "../Links/Links";

/**
 * TODO: show fallback if user is not authenticated.
 * TODO: check if all the features in dropdown are actually supported
 *       on beta launch.
 */
export const UserDropDown = () => {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  if (!user.username) {
    return null;
  }

  return (
    <DropDown
      contentAlignment="end"
      trigger={
        avatar ? (
          <AvatarButton src={avatar} username={user.username} />
        ) : (
          <Button.Root>
            <Button.ButtonIcon>
              <FontAwesomeIcon icon={faUser} />
            </Button.ButtonIcon>
          </Button.Root>
        )
      }
      content={[
        <UserLink key="user" user={user.username}>
          <RadixDropDown.Item>
            <div className={styles.dropDownUserInfo}>
              <Avatar src={avatar} username={user.username} />
              <div className={styles.dropdownUserInfoDetails}>
                <div className={styles.dropdownUserInfoDetails_userName}>
                  {user.username}
                </div>
                <div className={styles.dropdownUserInfoDetails_description}>
                  My profile
                </div>
              </div>
            </div>
          </RadixDropDown.Item>
        </UserLink>,

        <DropDownDivider key="divider-first" />,

        <TeamsLink key="teams">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faUsers} />}
                label="Teams"
              />
            }
          />
        </TeamsLink>,

        <a href="/subscriptons" key="subscriptions">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faCreditCard} />}
                label="Subscriptions"
              />
            }
          />
        </a>,

        <SettingsLink key="settings">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faCog} />}
                label="Settings"
              />
            }
          />
        </SettingsLink>,

        <DropDownDivider key="divider-second" />,

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
      ]}
    />
  );
};

UserDropDown.displayName = "UserDropDown";
