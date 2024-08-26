import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import { Popover, Icon } from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { Loginlist } from "./LoginList";

export function DesktopLoginPopover() {
  return (
    <Popover
      popoverId={"navAccount"}
      popoverRootClasses={styles.navAccountPopoverRoot}
      popoverWrapperClasses={styles.navAccountPopoverWrapper}
      trigger={
        <AvatarButton
          size="small"
          popovertarget="navAccount"
          popovertargetaction="open"
        />
      }
    >
      <button
        {...{
          popovertarget: "navAccount",
          popovertargetaction: "close",
        }}
        className={styles.navAccountPopoverCloseButton}
      >
        <Icon inline noWrapper>
          <FontAwesomeIcon icon={faXmark} />
        </Icon>
      </button>
      <nav className={styles.mobileNavPopoverList}>
        <Loginlist />
      </nav>
    </Popover>
  );
}
