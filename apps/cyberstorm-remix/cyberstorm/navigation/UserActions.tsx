import { faSignOut, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import { Avatar, CyberstormLink, Icon } from "@thunderstore/cyberstorm";
import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";
import {
  OverwolfLogo,
  ThunderstoreLogo,
} from "@thunderstore/cyberstorm/src/svg/svg";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { buildAuthLoginUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { CurrentUser } from "@thunderstore/dapper/types";

export function UserActions(props: { user: CurrentUser }) {
  const avatar = props.user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <>
      {props.user.username ? (
        [
          <div className={styles.mobileNavAccountPopoverItem} key="user">
            <Avatar src={avatar} username={props.user.username} size="small" />
            <div className={styles.dropdownUserInfoDetails}>
              <div className={styles.dropdownUserInfoDetails_userName}>
                {props.user.username}
              </div>
            </div>
          </div>,
          <CyberstormLink
            linkId="Settings"
            key="settings"
            className={styles.mobileNavAccountPopoverItem}
          >
            <DropDownLink
              leftIcon={<FontAwesomeIcon icon={faCog} />}
              label="Settings"
            />
          </CyberstormLink>,
          <CyberstormLink
            linkId="Teams"
            key="teams"
            className={styles.mobileNavAccountPopoverItem}
          >
            <DropDownLink
              leftIcon={<FontAwesomeIcon icon={faUsers} />}
              label="Teams"
            />
          </CyberstormLink>,
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
      ) : (
        <div className={styles.mobileLoginList}>
          <Icon wrapperClasses={styles.mobileTSLoginLogo}>
            <ThunderstoreLogo />
          </Icon>
          <h1 className={styles.mobileLoginTitle}>Log in to Thunderstore</h1>
          <div className={styles.mobileLoginLinkList}>
            <a
              className={classnames(styles.loginLink, styles.loginLinkDiscord)}
              href={buildAuthLoginUrl({ type: "discord" })}
            >
              <Icon inline>
                <FontAwesomeIcon icon={faDiscord} />
              </Icon>
              Connect with Discord
            </a>
            <a
              className={classnames(styles.loginLink, styles.loginLinkGithub)}
              href={buildAuthLoginUrl({ type: "github" })}
            >
              <Icon inline>
                <FontAwesomeIcon icon={faGithub} />
              </Icon>
              Connect with Github
            </a>
            <a
              className={classnames(styles.loginLink, styles.loginLinkOverwolf)}
              href={buildAuthLoginUrl({ type: "overwolf" })}
            >
              <Icon inline noWrapper>
                <OverwolfLogo />
              </Icon>
              Connect with Overwolf
            </a>
          </div>
        </div>
      )}
    </>
  );
}
