import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, memo, useState } from "react";

import {
  type DrawerSizes,
  type DrawerVariants,
} from "@thunderstore/cyberstorm-theme";

import {
  Frame,
  type FramePopoverProps,
} from "../../primitiveComponents/Frame/Frame";
import { type PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";
import { TopLayerContainerContext } from "../../utils/TopLayerContainerContext";
import { classnames, componentClasses } from "../../utils/utils";
import { Button as NewButton } from "../Button/Button";
import { Icon as NewIcon } from "../Icon/Icon";
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

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <>
      {trigger}
      <Frame
        ref={setContainer}
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
        <TopLayerContainerContext.Provider value={container}>
          <button
            type="button"
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
        </TopLayerContainerContext.Provider>
      </Frame>
    </>
  );
}

Drawer.displayName = "Drawer";

interface DrawerDividerProps extends PrimitiveComponentDefaultProps {
  csVariant?: DrawerVariants;
  csSize?: DrawerSizes;
}

export const DrawerDivider = memo(function DrawerDivider(
  props: DrawerDividerProps
) {
  const {
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    ...fProps
  } = props;
  return (
    <div
      className={classnames(
        "drawer__divider",
        ...componentClasses("drawer__divider", csVariant, csSize, undefined),
        rootClasses
      )}
      {...fProps}
    />
  );
});

DrawerDivider.displayName = "DrawerDivider";
