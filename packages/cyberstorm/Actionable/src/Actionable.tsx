import {
  CyberstormLink,
  type CyberstormLinkIds,
  type ThunderstoreLinkProps,
} from "@thunderstore/cyberstorm-links";
import React, { memo } from "react";
import {
  type PrimitiveComponentDefaultProps,
  TooltipWrapper,
} from "@thunderstore/cyberstorm-primitive-utils";

export interface ActionableButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    PrimitiveComponentDefaultProps {
  primitiveType?: "button";
  ref?: React.Ref<HTMLButtonElement>;
}

export interface ActionableLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "link";
  href: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

export interface ActionableCyberstormLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    PrimitiveComponentDefaultProps,
    ThunderstoreLinkProps {
  primitiveType: "cyberstormLink";
  linkId: CyberstormLinkIds;
  queryParams?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const Actionable = memo(function Actionable(
  props:
    | ActionableButtonProps
    | ActionableLinkProps
    | ActionableCyberstormLinkProps
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

  if (primitiveType === "button" || primitiveType === undefined) {
    const fRef = ref as React.ForwardedRef<HTMLButtonElement>;
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
    const fRef = ref as React.ForwardedRef<HTMLAnchorElement>;
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
    const fRef = ref as React.ForwardedRef<HTMLAnchorElement>;
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
});

Actionable.displayName = "Actionable";
