import popooverStyles from "./Popover.module.css";
import modalStyles from "./Modal.module.css";
import headingStyles from "./Heading.module.css";
import displayStyles from "./Display.module.css";
import { classnames } from "./../../utils/utils";
import React from "react";
import { PrimitiveComponentDefaultProps, TooltipWrapper } from "../utils/utils";

export interface FrameWindowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "window";
}

export interface FrameListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "list";
}

export interface FrameListItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "listItem";
}

// TODO: Turn this into the new "attachable window", used for dropdowns etc
interface FloaterProps extends PrimitiveComponentDefaultProps {
  primitiveType: "floater";
}

export interface FrameHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "heading";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
}

export interface FrameDisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "display";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
}

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "text";
}

interface PopoverProps extends PrimitiveComponentDefaultProps {
  primitiveType: "popover";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
}

interface ModalProps extends PrimitiveComponentDefaultProps {
  primitiveType: "modal";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
}

export const Frame = React.forwardRef<
  | HTMLDivElement
  | HTMLUListElement
  | HTMLLIElement
  | HTMLHeadingElement
  | HTMLParagraphElement,
  | FrameWindowProps
  | FrameListProps
  | FrameListItemProps
  | FloaterProps
  | FrameHeadingProps
  | FrameDisplayProps
  | TextProps
  | PopoverProps
  | ModalProps
>(
  (
    props:
      | FrameWindowProps
      | FrameListProps
      | FrameListItemProps
      | FloaterProps
      | FrameHeadingProps
      | FrameDisplayProps
      | TextProps
      | PopoverProps
      | ModalProps,
    forwardedRef
  ) => {
    const {
      children,
      primitiveType,
      csTextStyles,
      csColor,
      csVariant,
      csSize,
      rootClasses,
      tooltipText,
      tooltipSide,
      ...forwardedProps
    } = props;
    if (primitiveType === "window") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const fProps = forwardedProps as FrameWindowProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <div
            {...fProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </div>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "list") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLUListElement>;
      const fProps = forwardedProps as FrameListProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <ul
            {...fProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </ul>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "listItem") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLLIElement>;
      const fProps = forwardedProps as FrameListItemProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <li
            {...fProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </li>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "heading" || primitiveType == "display") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLHeadingElement>;
      const { csLevel, ...strippedForwardedProps } = forwardedProps as
        | FrameHeadingProps
        | FrameDisplayProps;
      const primitiveStyles =
        primitiveType === "heading"
          ? headingStyles.heading
          : displayStyles.display;
      let element;
      if (csLevel === "1") {
        element = (
          <h1
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h1>
        );
      } else if (csLevel === "2") {
        element = (
          <h2
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h2>
        );
      } else if (csLevel === "3") {
        element = (
          <h3
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h3>
        );
      } else if (csLevel === "4") {
        element = (
          <h4
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h4>
        );
      } else if (csLevel === "5") {
        element = (
          <h5
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h5>
        );
      } else if (csLevel === "6") {
        element = (
          <h6
            {...strippedForwardedProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              primitiveStyles,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </h6>
        );
      }
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          {element}
        </TooltipWrapper>
      );
    }
    if (primitiveType === "text") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLParagraphElement>;
      const textProps = forwardedProps as TextProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <p
            {...textProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </p>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "popover") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const {
        wrapperClasses,
        popoverId,
        noWrapper,
        ...strippedForwardedProps
      } = forwardedProps as PopoverProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <div
            {...strippedForwardedProps}
            id={popoverId}
            {...{ popover: "auto" }}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              popooverStyles.popover,
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {noWrapper ? (
              children
            ) : (
              <div className={wrapperClasses}>{children}</div>
            )}
          </div>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "modal") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const {
        wrapperClasses,
        popoverId,
        noWrapper,
        ...strippedForwardedProps
      } = forwardedProps as ModalProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <div
            {...strippedForwardedProps}
            id={popoverId}
            {...{ popover: "auto" }}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              modalStyles.modal
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {noWrapper ? (
              children
            ) : (
              <div className={rootClasses}>
                <div className={wrapperClasses}>{children}</div>
              </div>
            )}
          </div>
        </TooltipWrapper>
      );
    }
    return <p>Errored frame</p>;
  }
);

Frame.displayName = "Frame";
