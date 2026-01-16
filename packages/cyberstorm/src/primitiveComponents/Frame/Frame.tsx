import React, { type ReactNode, memo } from "react";
import { Children, cloneElement } from "react";

import {
  type PrimitiveComponentDefaultProps,
  TooltipWrapper,
} from "../utils/utils";
import { classnames } from "./../../utils/utils";

export interface FrameWindowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "window";
  ref?: React.ForwardedRef<HTMLDivElement>;
}

// TODO: Turn this into the new "attachable window", used for dropdowns etc
export interface FrameFloaterProps extends PrimitiveComponentDefaultProps {
  primitiveType: "floater";
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export interface FrameHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "heading";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
  ref?: React.ForwardedRef<HTMLHeadingElement>;
}

export interface FrameDisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "display";
  csLevel: "1" | "2" | "3" | "4" | "5" | "6";
  ref?: React.ForwardedRef<HTMLHeadingElement>;
}

export interface FrameTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "text";
  ref?: React.ForwardedRef<HTMLParagraphElement>;
}

export interface FramePopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "popover";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
  popoverMode?: "auto" | "manual";
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export interface FrameModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "modal";
  popoverId: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export interface FrameIconProps
  extends React.HTMLAttributes<HTMLDivElement | HTMLSpanElement | SVGElement>,
    Omit<PrimitiveComponentDefaultProps, "children"> {
  children?: ReactNode | ReactNode[];
  primitiveType: "icon";
  wrapperClasses?: string;
  noWrapper?: boolean;
  csMode?: "default" | "inline";
  ref?: React.ForwardedRef<HTMLDivElement | HTMLSpanElement | SVGElement>;
}

export const Frame = memo(function Frame(
  props:
    | FrameWindowProps
    | FrameFloaterProps
    | FrameHeadingProps
    | FrameDisplayProps
    | FrameTextProps
    | FramePopoverProps
    | FrameModalProps
    | FrameIconProps
) {
  const {
    children,
    primitiveType,
    rootClasses,
    tooltipText,
    tooltipSide,
    ref,
    ...forwardedProps
  } = props;
  if (primitiveType === "window") {
    const fRef = ref as React.ForwardedRef<HTMLDivElement>;
    const fProps = forwardedProps as FrameWindowProps;
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <div {...fProps} className={rootClasses} ref={fRef}>
          {children}
        </div>
      </TooltipWrapper>
    );
  }
  if (primitiveType === "heading" || primitiveType == "display") {
    const fRef = ref as React.ForwardedRef<HTMLHeadingElement>;
    const { csLevel, ...strippedForwardedProps } = forwardedProps as
      | FrameHeadingProps
      | FrameDisplayProps;
    let element;
    if (csLevel === "1") {
      element = (
        <h1 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
          {children}
        </h1>
      );
    } else if (csLevel === "2") {
      element = (
        <h2 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
          {children}
        </h2>
      );
    } else if (csLevel === "3") {
      element = (
        <h3 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
          {children}
        </h3>
      );
    } else if (csLevel === "4") {
      element = (
        <h4 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
          {children}
        </h4>
      );
    } else if (csLevel === "5") {
      element = (
        <h5 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
          {children}
        </h5>
      );
    } else if (csLevel === "6") {
      element = (
        <h6 {...strippedForwardedProps} className={rootClasses} ref={fRef}>
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
    const fRef = ref as React.ForwardedRef<HTMLParagraphElement>;
    const textProps = forwardedProps as FrameTextProps;
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <p {...textProps} className={rootClasses} ref={fRef}>
          {children}
        </p>
      </TooltipWrapper>
    );
  }
  if (primitiveType === "popover") {
    const fRef = ref as React.ForwardedRef<HTMLDivElement>;
    const {
      wrapperClasses,
      popoverId,
      noWrapper,
      popoverMode = "auto",
      ...strippedForwardedProps
    } = forwardedProps as FramePopoverProps;
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <div
          {...strippedForwardedProps}
          id={popoverId}
          {...{ popover: popoverMode }}
          className={rootClasses}
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
    const fRef = ref as React.ForwardedRef<HTMLDivElement>;
    const { popoverId, ...strippedForwardedProps } =
      forwardedProps as FrameModalProps;
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <div
          {...strippedForwardedProps}
          id={popoverId}
          {...{ popover: "auto" }}
          className={rootClasses}
          ref={fRef}
        >
          {children}
        </div>
      </TooltipWrapper>
    );
  }
  if (primitiveType === "icon") {
    if (!children) {
      return null;
    }

    const { wrapperClasses, noWrapper, csMode, ...strippedForwardedProps } =
      forwardedProps as FrameIconProps;

    let svgFProps: React.SVGProps<SVGElement> | null | undefined = null;
    if (noWrapper) {
      svgFProps = { ...(strippedForwardedProps as React.SVGProps<SVGElement>) };
    }

    const svgIconRef = ref as React.ForwardedRef<SVGElement>;

    let content = null;

    if (noWrapper) {
      content = (
        <>
          {Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return cloneElement(
                child as React.ReactElement<{ className?: string }>,
                {
                  className: classnames(
                    (child.props as { className?: string }).className,
                    "icon",
                    csMode === "inline" ? "icon--inline" : null,
                    rootClasses
                  ),
                  ref: svgIconRef,
                  ...svgFProps,
                }
              );
            } else {
              return null;
            }
          })}
        </>
      );
    } else if (csMode === "inline") {
      const spanIconRef = ref as React.ForwardedRef<HTMLSpanElement>;
      content = (
        <span
          {...strippedForwardedProps}
          className={wrapperClasses}
          ref={spanIconRef}
        >
          {Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return cloneElement(
                child as React.ReactElement<{ className?: string }>,
                {
                  className: classnames(
                    (child.props as { className?: string }).className,
                    "icon",
                    "icon--inline",
                    rootClasses
                  ),
                  ...svgFProps,
                }
              );
            } else {
              return null;
            }
          })}
        </span>
      );
    } else {
      const divIconRef = ref as React.ForwardedRef<HTMLDivElement>;
      content = (
        <div
          {...strippedForwardedProps}
          className={wrapperClasses}
          ref={divIconRef}
        >
          {Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return cloneElement(
                child as React.ReactElement<{ className?: string }>,
                {
                  className: classnames(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (child.props as { className?: string }).className,
                    "icon",
                    rootClasses
                  ),
                  ...svgFProps,
                }
              );
            } else {
              return null;
            }
          })}
        </div>
      );
    }

    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        {content}
      </TooltipWrapper>
    );
  }
  return <p>Errored frame</p>;
});

Frame.displayName = "Frame";
