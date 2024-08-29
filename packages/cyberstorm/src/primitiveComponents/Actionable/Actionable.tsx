import { PropsWithChildren } from "react";
import {
  CyberstormLink,
  CyberstormLinkIds,
} from "../../components/Links/Links";
import React from "react";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { ThunderstoreLinkProps } from "../../components/Links/LinkingProvider";

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

export interface ActionableDefaultProps extends PropsWithChildren {
  csColor?: colors;
  csSize?: sizes;
  csVariant?: variants;
  csMode?: modes;
  csWeight?: weights;
  rootClasses?: string;
  tooltipText?: string;
  tooltipSide?: "bottom" | "left" | "right" | "top";
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ActionableDefaultProps {
  primitiveType: "button";
}

export interface ActionableLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ActionableDefaultProps {
  primitiveType: "link";
  href: string;
}

export interface ActionableCyberstormLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ActionableDefaultProps,
    ThunderstoreLinkProps {
  primitiveType: "cyberstormLink";
  linkId: CyberstormLinkIds;
}

interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
  side?: "bottom" | "left" | "right" | "top";
}

const TooltipWrapper = (props: TooltipWrapperProps) =>
  props.tooltipText ? (
    <Tooltip content={props.tooltipText} side={props.side ?? "bottom"}>
      {props.children}
    </Tooltip>
  ) : (
    <>{props.children}</>
  );

export const Actionable = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | ActionableLinkProps | ActionableCyberstormLinkProps
>(
  (
    props: ButtonProps | ActionableLinkProps | ActionableCyberstormLinkProps,
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
      tooltipSide,
      ...forwardedProps
    } = props;

    if (primitiveType === "button") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
      const fProps = forwardedProps as ButtonProps;

      return (
        <TooltipWrapper tooltipText={tooltipText} side={tooltipSide}>
          <button
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
          </button>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "link") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
      const fProps = forwardedProps as ActionableLinkProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} side={tooltipSide}>
          <a
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
          </a>
        </TooltipWrapper>
      );
    }
    if (primitiveType === "cyberstormLink") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
      const { linkId, ...strippedForwardedProps } =
        forwardedProps as ActionableCyberstormLinkProps;
      return (
        <TooltipWrapper tooltipText={tooltipText} side={tooltipSide}>
          <CyberstormLink
            {...strippedForwardedProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            linkId={linkId}
            ref={fRef}
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
