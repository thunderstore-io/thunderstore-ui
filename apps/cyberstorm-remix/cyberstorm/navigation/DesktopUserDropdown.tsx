import { faSignOut, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixDropDown from "@radix-ui/react-dropdown-menu";

import styles from "./Navigation.module.css";
import {
  Avatar,
  DropDownDivider,
  DropDownItem,
  CyberstormLink,
  DropDown,
} from "@thunderstore/cyberstorm";
import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";
import { emptyUser } from "@thunderstore/dapper-ts/src/methods/currentUser";
import { CurrentUser } from "@thunderstore/dapper/types";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { useState, useEffect } from "react";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { DesktopLoginPopover } from "./DesktopLoginPopover";

export function DesktopUserDropdown() {
  const [user, setUser] = useState<CurrentUser>(emptyUser);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const dapper = await getDapper(true);
      const fetchedUser = await dapper.getCurrentUser();
      setUser(fetchedUser);
    };
    fetchAndSetUser();
  }, []);

  if (!user.username) {
    return <DesktopLoginPopover />;
  }

  // REMIX TODO: Turn this into a popover
  return (
    <DropDown
      contentAlignment="end"
      trigger={
        <AvatarButton src={avatar} username={user.username} size="small" />
      }
      content={[
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

        <CyberstormLink linkId="Settings" key="settings">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faCog} />}
                label="Settings"
              />
            }
          />
        </CyberstormLink>,

        <CyberstormLink linkId="Teams" key="teams">
          <DropDownItem
            content={
              <DropDownLink
                leftIcon={<FontAwesomeIcon icon={faUsers} />}
                label="Teams"
              />
            }
          />
        </CyberstormLink>,

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
}
