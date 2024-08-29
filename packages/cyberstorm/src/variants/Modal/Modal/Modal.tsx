import { PropsWithChildren, ReactNode } from "react";
import { Frame } from "../../../primitiveComponents/Frame/Frame";
import styles from "./Modal.module.css";
import { Button } from "../../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props extends PropsWithChildren {
  trigger: ReactNode;
  popoverId: string;
}

export function Modal(props: Props) {
  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="modal"
        popoverId={props.popoverId}
        csColor="purple"
        csSize="m"
        rootClasses={styles.modalRoot}
        wrapperClasses={styles.modalWrapper}
      >
        {/* STYLELIB UPDATE TODO: Use variant of primitive */}
        <Button.Root
          {...{
            popovertarget: props.popoverId,
            popovertargetaction: "close",
          }}
          colorScheme="transparentTertiary"
          className={styles.modalCloseButton}
          tooltipText="Close"
        >
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faXmark} />
          </Button.ButtonIcon>
        </Button.Root>
        {props.children}
      </Frame>
    </>
  );
}

Modal.displayName = "Modal";
