import styles from "./Navigation.module.css";
import { Modal } from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { LoginList } from "./LoginList";

export function DesktopLoginPopover() {
  return (
    <Modal
      popoverId={"navAccount"}
      trigger={
        <AvatarButton
          size="small"
          popovertarget="navAccount"
          popovertargetaction="open"
        />
      }
    >
      <nav className={styles.mobileNavPopoverList}>
        <LoginList />
      </nav>
    </Modal>
  );
}
