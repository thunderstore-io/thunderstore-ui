import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Navigation.module.css";
import { Popover } from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import * as Button from "@thunderstore/cyberstorm/src/components/Button/index";
import { LoginList } from "./LoginList";

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
      <Button.Root
        {...{
          popovertarget: "navAccount",
          popovertargetaction: "close",
        }}
        colorScheme="transparentTertiary"
        className={styles.navAccountPopoverCloseButton}
        tooltipText="Close"
      >
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faXmark} />
        </Button.ButtonIcon>
      </Button.Root>
      <nav className={styles.mobileNavPopoverList}>
        <LoginList />
      </nav>
    </Popover>
  );
}
