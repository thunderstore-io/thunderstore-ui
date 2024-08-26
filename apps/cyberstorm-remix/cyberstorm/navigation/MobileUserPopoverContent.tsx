import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import {
  Avatar,
  CyberstormLink,
  Icon,
  Popover,
} from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { CurrentUser } from "@thunderstore/dapper/types";

import { faSignOut, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";
import { Loginlist } from "./LoginList";

export function MobileUserPopoverContent(props: { user: CurrentUser }) {
  const { user } = props;
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <div className={styles.mobileNavItem}>
      <Popover
        popoverId={"mobileNavAccount"}
        popoverRootClasses={styles.mobileNavAccountPopoverRoot}
        popoverWrapperClasses={styles.mobileNavAccountPopoverWrapper}
        trigger={
          <AvatarButton
            src={avatar}
            username={user.username}
            size="verySmoll"
            popovertarget={"mobileNavAccount"}
            popovertargetaction={"open"}
          />
        }
      >
        <button
          {...{
            popovertarget: "mobileNavAccount",
            popovertargetaction: "close",
          }}
          className={styles.popoverCloseButton}
        >
          <Icon inline noWrapper iconClasses={styles.popoverCloseButtonIcon}>
            <FontAwesomeIcon icon={faLongArrowLeft} />
          </Icon>
        </button>
        <nav className={styles.mobileNavPopoverList}>
          {user.username ? (
            [
              <div className={styles.accountPopoverItem} key="user">
                <AvatarButton
                  src={avatar}
                  username={user.username}
                  size="small"
                />
                <div className={styles.dropdownUserInfoDetails}>
                  <div className={styles.dropdownUserInfoDetails_userName}>
                    {user.username}
                  </div>
                </div>
              </div>,
              <CyberstormLink
                linkId="Settings"
                key="settings"
                className={styles.accountPopoverItem}
              >
                <DropDownLink
                  leftIcon={<FontAwesomeIcon icon={faCog} />}
                  label="Settings"
                />
              </CyberstormLink>,
              <CyberstormLink
                linkId="Teams"
                key="teams"
                className={styles.accountPopoverItem}
              >
                <DropDownLink
                  leftIcon={<FontAwesomeIcon icon={faUsers} />}
                  label="Teams"
                />
              </CyberstormLink>,
              <a
                href="/logout"
                key="logout"
                className={styles.accountPopoverItem}
              >
                <DropDownLink
                  leftIcon={<FontAwesomeIcon icon={faSignOut} />}
                  label="Log Out"
                />
              </a>,
            ]
          ) : (
            <Loginlist />
          )}
        </nav>
      </Popover>
      Account
    </div>
  );
}
