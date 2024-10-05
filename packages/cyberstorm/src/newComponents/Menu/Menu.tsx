import { ReactNode } from "react";

import styles from "./Menu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NewButton, NewIcon } from "../..";
import {
  FramePopoverProps,
  Frame,
} from "../../primitiveComponents/Frame/Frame";

interface Props extends Omit<FramePopoverProps, "primitiveType"> {
  trigger: ReactNode;
  controls?: ReactNode;
}

// TODO: Add storybook story
// TODO: Add support for color, size and text systems
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
        {props.controls ? (
          props.controls
        ) : (
          <NewButton
            {...{
              popovertarget: props.popoverId,
              popovertargetaction: "close",
            }}
            csVariant="tertiary"
            className={styles.menuCloseButton}
            tooltipText="Close"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmark} />
            </NewIcon>
          </NewButton>
        )}

        {props.children}
      </Frame>
    </>
  );
}

Menu.displayName = "Menu";
