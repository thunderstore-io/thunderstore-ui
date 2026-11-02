import React, { memo } from "react";

import {
  type ThunderstoreLinkProps,
  thunderstoreLinkProps,
} from "../../components/Links/LinkingProvider";
import {
  CyberstormLink,
  type CyberstormLinkIds,
} from "../../components/Links/Links";
import { classnames } from "../../utils/utils";
import {
  type PrimitiveComponentDefaultProps,
  TooltipWrapper,
} from "../utils/utils";

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

/** An anchor with no href cannot be opened, including via middle-click. */
function DisabledAnchor(props: {
  anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  className: string | undefined;
  anchorRef: React.ForwardedRef<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  const anchorProps: Record<string, unknown> = { ...props.anchorProps };
  delete anchorProps.href;
  delete anchorProps.onClick;
  delete anchorProps.queryParams;
  delete anchorProps.url;
  for (const key of Object.keys(thunderstoreLinkProps)) {
    delete anchorProps[key];
  }

  return (
    <a
      {...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      className={props.className}
      ref={props.anchorRef}
      role="link"
      aria-disabled="true"
      tabIndex={-1}
    >
      {props.children}
    </a>
  );
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
    const { className, ...fProps } = forwardedProps as ActionableButtonProps;

    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <button
          {...fProps}
          className={classnames(rootClasses, className)}
          ref={fRef}
        >
          {children}
        </button>
      </TooltipWrapper>
    );
  }
  if (primitiveType === "link") {
    const fRef = ref as React.ForwardedRef<HTMLAnchorElement>;
    const { disabled, className, ...fProps } =
      forwardedProps as ActionableLinkProps;
    const anchorClassName = classnames(rootClasses, className);
    if (disabled) {
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <DisabledAnchor
            anchorProps={fProps}
            className={anchorClassName}
            anchorRef={fRef}
          >
            {children}
          </DisabledAnchor>
        </TooltipWrapper>
      );
    }
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <a {...fProps} className={anchorClassName} ref={fRef}>
          {children}
        </a>
      </TooltipWrapper>
    );
  }
  if (primitiveType === "cyberstormLink") {
    const fRef = ref as React.ForwardedRef<HTMLAnchorElement>;
    const { linkId, disabled, className, ...strippedForwardedProps } =
      forwardedProps as ActionableCyberstormLinkProps;
    const anchorClassName = classnames(rootClasses, className);
    if (disabled) {
      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <DisabledAnchor
            anchorProps={strippedForwardedProps}
            className={anchorClassName}
            anchorRef={fRef}
          >
            {children}
          </DisabledAnchor>
        </TooltipWrapper>
      );
    }
    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <CyberstormLink
          {...strippedForwardedProps}
          className={anchorClassName}
          linkId={linkId}
          ref={fRef}
        >
          {children}
        </CyberstormLink>
      </TooltipWrapper>
    );
  }
  return <p>Errored actionable</p>;
});

Actionable.displayName = "Actionable";
