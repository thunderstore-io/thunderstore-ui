import { ReactNode } from "react";

import "./Menu.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NewButton } from "../..";
import {
  FramePopoverProps,
  Frame,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import { MenuVariants } from "@thunderstore/cyberstorm-theme/src/components";

interface Props extends Omit<FramePopoverProps, "primitiveType"> {
  trigger?: ReactNode;
  controls?: ReactNode;
  csVariant?: MenuVariants;
}

// TODO: Add storybook story
// TODO: Add support for color, size and text systems
export function Menu(props: Props) {
  const { rootClasses, csVariant } = props;

  return (
    <>
      {props.trigger}
      <Frame
        primitiveType="popover"
        popoverId={props.popoverId}
        rootClasses={classnames(
          "ts-menu",
          ...componentClasses(csVariant, undefined, undefined),
          rootClasses
        )}
        noWrapper
        popoverMode="manual"
      >
        <div
          className={classnames(
            "ts-menu__wrapper",
            ...componentClasses(csVariant, undefined, undefined)
          )}
        >
          {props.controls ? (
            props.controls
          ) : (
            <NewButton
              {...{
                popovertarget: props.popoverId,
                popovertargetaction: "close",
              }}
              csVariant="secondary"
              csModifiers={["ghost", "dimmed"]}
              tooltipText="Close"
              aria-label="Close"
              icon={faXmark}
            />
          )}
          {props.children}
        </div>
        <button
          className={classnames(
            "ts-menu__fakebackdrop",
            ...componentClasses(csVariant, undefined, undefined)
          )}
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
