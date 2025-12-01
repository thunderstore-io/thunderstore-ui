import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode } from "react";

import {
  type DrawerSizes,
  type DrawerVariants,
} from "@thunderstore/cyberstorm-theme";

import { NewButton, NewIcon } from "../..";
import {
  Frame,
  type FramePopoverProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Drawer.css";

interface Props extends Omit<FramePopoverProps, "primitiveType"> {
  csVariant?: DrawerVariants;
  csSize?: DrawerSizes;
  trigger?: ReactNode;
  controls?: ReactNode;
  headerContent?: ReactNode;
}

// TODO: Add storybook story
// TODO: Add support for color, size and text systems
export function Drawer(props: Props) {
  const {
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    trigger,
    controls,
    headerContent,
    children,
    popoverId,
  } = props;

  return (
    <>
      {trigger}
      <Frame
        primitiveType="popover"
        popoverId={popoverId}
        rootClasses={classnames(
          "drawer__wrapper",
          ...componentClasses("drawer__wrapper", csVariant, csSize, undefined),
          rootClasses
        )}
        noWrapper
        popoverMode="manual"
      >
        <button
          className={classnames(
            "drawer__fake-backdrop",
            ...componentClasses(
              "drawer__fake-backdrop",
              csVariant,
              undefined,
              undefined
            )
          )}
          popoverTarget={popoverId}
          popoverTargetAction="hide"
          aria-hidden
          tabIndex={-1}
        />
        <div
          className={classnames(
            "drawer",
            ...componentClasses("drawer", csVariant, csSize, undefined)
          )}
        >
          <div className="drawer__header">
            <div className="drawer__header-content">{headerContent}</div>
            {controls ? (
              controls
            ) : (
              <NewButton
                popoverTarget={popoverId}
                popoverTargetAction="hide"
                csVariant="secondary"
                csModifiers={["ghost", "only-icon"]}
                tooltipText="Close"
                aria-label="Close"
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faXmarkLarge} />
                </NewIcon>
              </NewButton>
            )}
          </div>
          <div className="drawer__content">{children}</div>
        </div>
      </Frame>
    </>
  );
}

Drawer.displayName = "Drawer";
