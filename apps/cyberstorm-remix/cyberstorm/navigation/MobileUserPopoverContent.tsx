import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import {
  Avatar,
  Menu,
  NewIcon,
  NewLink,
  NewText,
} from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { CurrentUser } from "@thunderstore/dapper/types";

import { faSignOut, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

import { LoginList } from "./LoginList";

export function MobileUserPopoverContent(props: { user: CurrentUser }) {
  const { user } = props;
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <Menu
      popoverId={"mobileNavAccount"}
      trigger={
        <div className={styles.mobileNavItem}>
          <AvatarButton
            src={avatar}
            username={user.username}
            size="verySmoll"
            popovertarget={"mobileNavAccount"}
            popovertargetaction={"open"}
          />
          Account
        </div>
      }
      controls={
        <button
          {...{
            popovertarget: "mobileNavAccount",
            popovertargetaction: "close",
          }}
          className={styles.popoverCloseButton}
        >
          <NewIcon csMode="inline" csVariant="tertiary" noWrapper>
            <FontAwesomeIcon icon={faLongArrowLeft} />
          </NewIcon>
        </button>
      }
    >
      {user.username ? (
        <div className={styles.mobileNavPopover}>
          <div className={styles.accountPopoverUser}>
            <Avatar src={avatar} username={user.username} size="small" />
            <NewText
              rootClasses={styles.dropdownUserInfoDetails}
              csTextStyles={["fontSizeM", "fontWeightBold"]}
            >
              {user.username}
            </NewText>
          </div>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Settings"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCog} />
            </NewIcon>
            Settings
          </NewLink>
          <NewLink
            primitiveType="cyberstormLink"
            linkId="Teams"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faUsers} />
            </NewIcon>
            Teams
          </NewLink>
          <NewLink
            primitiveType="link"
            href="/logout"
            csVariant="primary"
            rootClasses={styles.accountPopoverItem}
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faSignOut} />
            </NewIcon>
            Log Out
          </NewLink>
        </div>
      ) : (
        <LoginList />
      )}
    </Menu>
  );
}
