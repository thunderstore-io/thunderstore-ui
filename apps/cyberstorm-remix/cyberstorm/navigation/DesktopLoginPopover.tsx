import styles from "./Navigation.module.css";
import { Modal, NewButton, NewIcon } from "@thunderstore/cyberstorm";
import { LoginList } from "./LoginList";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DesktopLoginPopover() {
  return (
    <Modal
      popoverId={"navAccount"}
      trigger={
        <NewButton
          csVariant="primary"
          csColor="purple"
          csSize="l"
          rootClasses={styles.loginButton}
          {...{
            popovertarget: "navAccount",
            popovertargetaction: "open",
          }}
          csTextStyles={["fontSizeS", "fontWeightBold", "lineHeightAuto"]}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </NewIcon>
          Log In
        </NewButton>
      }
    >
      <LoginList />
    </Modal>
  );
}
