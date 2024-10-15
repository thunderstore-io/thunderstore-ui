import { ReactNode } from "react";
import { Frame, FrameModalProps } from "../../primitiveComponents/Frame/Frame";
import styles from "./Modal.module.css";
import { NewButton, NewIcon } from "../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props extends Omit<FrameModalProps, "primitiveType"> {
  trigger: ReactNode;
}

// TODO: Add storybook story
export function Modal(props: Props) {
  const { csColor = "surface", csVariant = "default" } = props;

  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="modal"
        popoverId={props.popoverId}
        csVariant={csVariant}
        csColor={csColor}
        csSize="m"
        rootClasses={styles.modalRoot}
        wrapperClasses={styles.modalWrapper}
      >
        <NewButton
          {...{
            popovertarget: props.popoverId,
            popovertargetaction: "close",
          }}
          csVariant="tertiary"
          csColor={csColor}
          rootClasses={styles.modalCloseButton}
          tooltipText="Close"
        >
          <NewIcon noWrapper>
            <FontAwesomeIcon icon={faXmark} />
          </NewIcon>
        </NewButton>
        {props.children}
      </Frame>
    </>
  );
}

Modal.displayName = "Modal";
