import {
  CyberstormLink,
  CyberstormLinkIds,
} from "../../components/Links/Links";
import React from "react";
import { ThunderstoreLinkProps } from "../../components/Links/LinkingProvider";
import { PrimitiveComponentDefaultProps, TooltipWrapper } from "../utils/utils";

export interface ActionableButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    PrimitiveComponentDefaultProps {
  primitiveType?: "button";
}

export interface ActionableLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "link";
  href: string;
  disabled?: boolean;
}

export interface ActionableCyberstormLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    PrimitiveComponentDefaultProps,
    ThunderstoreLinkProps {
  primitiveType: "cyberstormLink";
  linkId: CyberstormLinkIds;
  queryParams?: string;
  disabled?: boolean;
}

export const Actionable = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ActionableButtonProps | ActionableLinkProps | ActionableCyberstormLinkProps
>(
  (
    props:
      | ActionableButtonProps
      | ActionableLinkProps
      | ActionableCyberstormLinkProps,
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

    if (primitiveType === "button" || primitiveType === undefined) {
      const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
      const fProps = forwardedProps as ActionableButtonProps;

      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <button {...fProps} className={rootClasses} ref={fRef}>
            {children}
          </button>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "link") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
      const { disabled, ...fProps } = forwardedProps as ActionableLinkProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <a
            {...fProps}
            className={rootClasses}
            ref={fRef}
            aria-disabled={disabled}
          >
            {children}
          </a>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "cyberstormLink") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
      const { linkId, disabled, ...strippedForwardedProps } =
        forwardedProps as ActionableCyberstormLinkProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <CyberstormLink
            {...strippedForwardedProps}
            className={rootClasses}
            linkId={linkId}
            ref={fRef}
            aria-disabled={disabled}
          >
            {children}
          </CyberstormLink>
        </TooltipWrapper>
      );
    }
    return <p>Errored actionable</p>;
  }
);

Actionable.displayName = "Actionable";
