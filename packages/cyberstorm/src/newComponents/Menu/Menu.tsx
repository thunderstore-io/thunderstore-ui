import { ReactNode } from "react";

import styles from "./Menu.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NewButton } from "../..";
import {
  FramePopoverProps,
  Frame,
} from "../../primitiveComponents/Frame/Frame";
import { classnames } from "../../utils/utils";

interface Props extends Omit<FramePopoverProps, "primitiveType"> {
  trigger?: ReactNode;
  controls?: ReactNode;
}

// TODO: Add storybook story
// TODO: Add support for color, size and text systems
export function Menu(props: Props) {
  const { rootClasses } = props;

  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="popover"
        popoverId={props.popoverId}
        csColor="pink"
        csSize="m"
        rootClasses={classnames(styles.menuRoot, rootClasses)}
        noWrapper
        popoverMode="manual"
      >
        <div className={styles.menuWrapper}>
          {props.controls ? (
            props.controls
          ) : (
            <NewButton
              {...{
                popovertarget: props.popoverId,
                popovertargetaction: "close",
              }}
              csVariant="tertiaryDimmed"
              tooltipText="Close"
              aria-label="Close"
              icon={faXmark}
            />
          )}
          {props.children}
        </div>
        <button
          className={styles.fakeBackdrop}
          {...{
            popovertarget: props.popoverId,
            popovertargetaction: "close",
          }}
          aria-hidden
          tabIndex={-1}
        />
      </Frame>
    </>
  );
}

Menu.displayName = "Menu";
