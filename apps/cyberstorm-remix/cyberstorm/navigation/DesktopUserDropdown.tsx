import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import {
  Avatar,
  NewDropDown,
  NewDropDownItem,
  NewDropDownDivider,
  NewLink,
  NewIcon,
} from "@thunderstore/cyberstorm";
import { CurrentUser } from "@thunderstore/dapper/types";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

export function DesktopUserDropdown(props: { user: CurrentUser }) {
  const { user } = props;

  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  // REMIX TODO: Turn this into a popover
  return (
    <NewDropDown
      contentAlignment="end"
      trigger={
        <AvatarButton src={avatar} username={user.username} size="small" />
      }
    >
      <NewDropDownItem rootClasses={styles.dropDownUserInfo}>
        <div>
          <Avatar src={avatar} username={user.username} size="small" />
          <p className={styles.dropdownUserInfoDetails}>{user.username}</p>
        </div>
      </NewDropDownItem>
      <NewDropDownDivider />
      {/* <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Settings"
          rootClasses={classnames("ts-dropdown__item", styles.dropDownItem)}
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
          Settings
        </NewLink>
      </NewDropDownItem> */}
      {/* <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          rootClasses={classnames("ts-dropdown__item", styles.dropDownItem)}
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faUsers} />
          </NewIcon>
          Teams
        </NewLink>
      </NewDropDownItem> */}
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="link"
          href="/logout"
          rootClasses={classnames("ts-dropdown__item", styles.dropDownItem)}
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faSignOut} />
          </NewIcon>
          Log Out
        </NewLink>
      </NewDropDownItem>
    </NewDropDown>
  );
}
