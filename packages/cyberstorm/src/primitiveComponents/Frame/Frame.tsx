import { PropsWithChildren } from "react";
import popooverStyles from "./Popover.module.css";
import modalStyles from "./Modal.module.css";
import headingStyles from "./Heading.module.css";
import displayStyles from "./Display.module.css";
import { classnames } from "./../../utils/utils";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import React from "react";

type variants =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "special";
type colors =
  | "surface"
  | "surface-alpha"
  | "blue"
  | "pink"
  | "red"
  | "orange"
  | "green"
  | "yellow"
  | "purple"
  | "cyber-green";
type sizes = "xs" | "s" | "m" | "l";
type modes = "auto" | "body";
type weights = "regular" | "medium" | "semiBold" | "bold";

interface DefaultProps extends PropsWithChildren {
  csColor?: colors;
  csSize?: sizes;
  csVariant?: variants;
  csMode?: modes;
  csWeight?: weights;
  rootClasses?: string;
  tooltipText?: string;
}

export interface FrameWindowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    DefaultProps {
  primitiveType: "window";
}

export interface FrameListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    DefaultProps {
  primitiveType: "list";
}

export interface FrameListItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    DefaultProps {
  primitiveType: "listItem";
}

// TODO: Turn this into the new "attachable window", used for dropdowns etc
interface FloaterProps extends DefaultProps {
  primitiveType: "floater";
}

export interface FrameHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    DefaultProps {
  primitiveType: "heading";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
}

export interface FrameDisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    DefaultProps {
  primitiveType: "display";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
}

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    DefaultProps {
  primitiveType: "text";
}

interface PopoverProps extends DefaultProps {
  primitiveType: "popover";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
}

interface ModalProps extends DefaultProps {
  primitiveType: "modal";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
}

interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
}

const TooltipWrapper = (props: TooltipWrapperProps) =>
  props.tooltipText ? (
    <Tooltip content={props.tooltipText} side="bottom">
      {props.children}
    </Tooltip>
  ) : (
    <>{props.children}</>
  );

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
      rootClasses,
      csColor,
      csSize,
      csVariant,
      csMode,
      csWeight,
      tooltipText,
      ...forwardedProps
    } = props;
    if (primitiveType === "window") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const fProps = forwardedProps as FrameWindowProps;
      return (
        <TooltipWrapper tooltipText={tooltipText}>
          <div
            {...fProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
        <TooltipWrapper tooltipText={tooltipText}>
          <ul
            {...fProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
        <TooltipWrapper tooltipText={tooltipText}>
          <li
            {...fProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h1>
        );
      } else if (csLevel === "2") {
        element = (
          <h2
            {...strippedForwardedProps}
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h2>
        );
      } else if (csLevel === "3") {
        element = (
          <h3
            {...strippedForwardedProps}
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h3>
        );
      } else if (csLevel === "4") {
        element = (
          <h4
            {...strippedForwardedProps}
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h4>
        );
      } else if (csLevel === "5") {
        element = (
          <h5
            {...strippedForwardedProps}
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h5>
        );
      } else if (csLevel === "6") {
        element = (
          <h6
            {...strippedForwardedProps}
            className={classnames(primitiveStyles, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </h6>
        );
      }
      return (
        <TooltipWrapper tooltipText={tooltipText}>{element}</TooltipWrapper>
      );
    }
    if (primitiveType === "text") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLParagraphElement>;
      const { csWeight, ...strippedForwardedProps } =
        forwardedProps as TextProps;
      return (
        <TooltipWrapper tooltipText={tooltipText}>
          <p
            {...strippedForwardedProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
        <TooltipWrapper tooltipText={tooltipText}>
          <div
            {...strippedForwardedProps}
            id={popoverId}
            {...{ popover: "auto" }}
            className={classnames(popooverStyles.popover, rootClasses)}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
        <TooltipWrapper tooltipText={tooltipText}>
          <div
            {...strippedForwardedProps}
            id={popoverId}
            {...{ popover: "auto" }}
            className={modalStyles.modal}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
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
