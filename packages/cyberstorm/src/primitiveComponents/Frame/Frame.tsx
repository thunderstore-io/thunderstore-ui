import iconStyles from "./Icon.module.css";
import { classnames } from "./../../utils/utils";
import React from "react";
import { PrimitiveComponentDefaultProps, TooltipWrapper } from "../utils/utils";
import { Children, cloneElement } from "react";

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
export interface FrameFloaterProps extends PrimitiveComponentDefaultProps {
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

export interface FrameTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "text";
}

export interface FramePopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "popover";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
  popoverMode?: "auto" | "manual";
}

export interface FrameModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "modal";
  popoverId: string;
  wrapperClasses?: string;
  noWrapper?: boolean;
}

export interface FrameIconProps
  extends React.HTMLAttributes<HTMLDivElement | HTMLSpanElement | SVGElement>,
    Omit<PrimitiveComponentDefaultProps, "children"> {
  children?: JSX.Element | JSX.Element[];
  primitiveType: "icon";
  wrapperClasses?: string;
  noWrapper?: boolean;
  csMode?: "default" | "inline";
}

export const Frame = React.forwardRef<
  | HTMLDivElement
  | HTMLUListElement
  | HTMLLIElement
  | HTMLHeadingElement
  | HTMLParagraphElement
  | HTMLSpanElement
  | SVGElement,
  | FrameWindowProps
  | FrameListProps
  | FrameListItemProps
  | FrameFloaterProps
  | FrameHeadingProps
  | FrameDisplayProps
  | FrameTextProps
  | FramePopoverProps
  | FrameModalProps
  | FrameIconProps
>(
  (
    props:
      | FrameWindowProps
      | FrameListProps
      | FrameListItemProps
      | FrameFloaterProps
      | FrameHeadingProps
      | FrameDisplayProps
      | FrameTextProps
      | FramePopoverProps
      | FrameModalProps
      | FrameIconProps,
    forwardedRef
  ) => {
    const {
      children,
      primitiveType,
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
          <div {...fProps} className={rootClasses} ref={fRef}>
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
          <ul {...fProps} className={rootClasses} ref={fRef}>
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
          <li {...fProps} className={rootClasses} ref={fRef}>
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
      const fRef = forwardedRef as React.ForwardedRef<HTMLParagraphElement>;
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
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
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
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const {
        wrapperClasses,
        popoverId,
        noWrapper,
        ...strippedForwardedProps
      } = forwardedProps as FrameModalProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <div
            {...strippedForwardedProps}
            id={popoverId}
            {...{ popover: "auto" }}
            className={rootClasses}
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
    if (primitiveType === "icon") {
      if (!children) {
        return null;
      }

      const { wrapperClasses, noWrapper, csMode, ...strippedForwardedProps } =
        forwardedProps as FrameIconProps;

      let svgFProps: (Partial<unknown> & React.Attributes) | null | undefined =
        null;
      if (noWrapper) {
        svgFProps = { ...strippedForwardedProps };
      }

      const svgIconRef = forwardedRef as React.ForwardedRef<SVGElement>;

      const clones = Children.map(children, (child) =>
        cloneElement(child, {
          className: classnames(
            child.props.className,
            iconStyles.icon,
            noWrapper && csMode === "inline" ? iconStyles.inline : null,
            rootClasses
          ),
          ref: noWrapper ? svgIconRef : null,
          ...svgFProps,
        })
      );

      let content = null;

      if (noWrapper) {
        content = <>{clones}</>;
      } else if (csMode === "inline") {
        const spanIconRef = forwardedRef as React.ForwardedRef<HTMLSpanElement>;
        content = (
          <span
            {...strippedForwardedProps}
            className={classnames(
              iconStyles.iconWrapper,
              iconStyles.inline,
              wrapperClasses
            )}
            ref={spanIconRef}
          >
            {clones}
          </span>
        );
      } else {
        const divIconRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
        content = (
          <div
            {...strippedForwardedProps}
            className={classnames(iconStyles.iconWrapper, wrapperClasses)}
            ref={divIconRef}
          >
            {clones}
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
  }
);

Frame.displayName = "Frame";
