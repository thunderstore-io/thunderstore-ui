import { faSignOut, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import dropdownStyles from "../../../../packages/cyberstorm/src/newComponents/DropDown/DropDown.module.css";
import {
  Avatar,
  NewDropDown,
  NewText,
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
      csVariant="default"
      csColor="surface"
    >
      <NewDropDownItem rootClasses={styles.dropDownUserInfo}>
        <Avatar src={avatar} username={user.username} size="small" />
        <NewText rootClasses={styles.dropdownUserInfoDetails}>
          {user.username}
        </NewText>
      </NewDropDownItem>
      <NewDropDownDivider csVariant="default" csColor="surface" />
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Settings"
          csVariant="default"
          csColor="surface"
          rootClasses={classnames(
            dropdownStyles.dropdownItem,
            styles.dropDownItem
          )}
          csTextStyles={["fontSizeS", "fontWeightRegular"]}
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faCog} />
          </NewIcon>
          Settings
        </NewLink>
      </NewDropDownItem>
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="cyberstormLink"
          linkId="Teams"
          csVariant="default"
          csColor="surface"
          rootClasses={classnames(
            dropdownStyles.dropdownItem,
            styles.dropDownItem
          )}
          csTextStyles={["fontSizeS", "fontWeightRegular"]}
        >
          <NewIcon csMode="inline" noWrapper csVariant="tertiary">
            <FontAwesomeIcon icon={faUsers} />
          </NewIcon>
          Teams
        </NewLink>
      </NewDropDownItem>
      <NewDropDownItem asChild>
        <NewLink
          primitiveType="link"
          href="/logout"
          csVariant="default"
          csColor="surface"
          rootClasses={classnames(
            dropdownStyles.dropdownItem,
            styles.dropDownItem
          )}
          csTextStyles={["fontSizeS", "fontWeightRegular"]}
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
