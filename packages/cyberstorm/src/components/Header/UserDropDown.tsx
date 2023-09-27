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
import { Button } from "../Button/Button";
import { DropDown, DropDownDivider, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";
import { SettingsLink, TeamsLink, UserLink } from "../Links/Links";

/**
 * TODO: replace dapper.getUser with .getCurrentUser.
 * TODO: show fallback if user is not authenticated.
 * TODO: check if all the features in dropdown are actually supported
 *       on beta launch.
 */
export const UserDropDown = () => {
  const userId = "headerUser";
  const dapper = useDapper();
  const userData = usePromise(dapper.getUser, [userId]);

  if (!userData.user) {
    return null; // TODO: required due to missing Dapper implementation.
  }

  return (
    <DropDown
      contentAlignment="end"
      trigger={
        userData.user.imageSource ? (
          <AvatarButton src={userData.user.imageSource} />
        ) : (
          <Button leftIcon={<FontAwesomeIcon icon={faUser} fixedWidth />} />
        )
      }
      content={[
        <UserLink key="user" user={userData.user.name}>
          <RadixDropDown.Item>
            <div className={styles.dropDownUserInfo}>
              {userData.user.imageSource ? (
                <Avatar src={userData.user.imageSource} />
              ) : null}
              <div className={styles.dropdownUserInfoDetails}>
                <div className={styles.dropdownUserInfoDetails_userName}>
                  {userData.user.name}
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
                leftIcon={<FontAwesomeIcon icon={faUsers} fixedWidth />}
                label="Teams"
              />
            }
          />
        </TeamsLink>,

        <a href="/subscriptons" key="subscriptions">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faCreditCard} fixedWidth />}
                label="Subscriptions"
              />
            }
          />
        </a>,

        <SettingsLink key="settings">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
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
                leftIcon={<FontAwesomeIcon icon={faSignOut} fixedWidth />}
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
