import { PropsWithChildren, ReactNode } from "react";
import { Frame } from "../../../primitiveComponents/Frame/Frame";
import styles from "./Menu.module.css";
import { Button } from "../../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props extends PropsWithChildren {
  trigger: ReactNode;
  popoverId: string;
  controls?: ReactNode;
}

export function Menu(props: Props) {
  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="popover"
        popoverId={props.popoverId}
        csColor="pink"
        csSize="m"
        rootClasses={styles.menuRoot}
        wrapperClasses={styles.menuWrapper}
      >
        {/* STYLELIB UPDATE TODO: Use variant of primitive */}
        {props.controls ? (
          props.controls
        ) : (
          <Button.Root
            {...{
              popovertarget: props.popoverId,
              popovertargetaction: "close",
            }}
            colorScheme="transparentTertiary"
            className={styles.menuCloseButton}
            tooltipText="Close"
          >
            <Button.ButtonIcon>
              <FontAwesomeIcon icon={faXmark} />
            </Button.ButtonIcon>
          </Button.Root>
        )}

        {props.children}
      </Frame>
    </>
  );
}

Menu.displayName = "Menu";
