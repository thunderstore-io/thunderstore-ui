import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode } from "react";

import { type MenuVariants } from "@thunderstore/cyberstorm-theme";

import { NewButton, NewIcon } from "../..";
import {
  Frame,
  type FramePopoverProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Menu.css";

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
          "menu",
          ...componentClasses("menu", csVariant, undefined, undefined),
          rootClasses
        )}
        noWrapper
        popoverMode="manual"
      >
        <div
          className={classnames(
            "menu__wrapper",
            ...componentClasses(
              "menu__wrapper",
              csVariant,
              undefined,
              undefined
            )
          )}
        >
          {props.controls ? (
            props.controls
          ) : (
            <NewButton
              popoverTarget={props.popoverId}
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
          {props.children}
        </div>
        <button
          className={classnames(
            "menu__fake-backdrop",
            ...componentClasses(
              "menu__fake-backdrop",
              csVariant,
              undefined,
              undefined
            )
          )}
          popoverTarget={props.popoverId}
          popoverTargetAction="hide"
          aria-hidden
          tabIndex={-1}
        />
      </Frame>
    </>
  );
}

Menu.displayName = "Menu";
