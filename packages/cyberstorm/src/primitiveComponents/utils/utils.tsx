import { PropsWithChildren } from "react";
import { Tooltip } from "../..";

// TODO: It would be nice if we forced storybook generation of all of the possible combinations.
// If we do that, we'll have to handle the "unsupported combinations" gracefully somehow.
// Best would be if we could have typescript warnings and force each "non-supported combination" to be explicitly
// unsupported. See NewButtons story in storybook for reference

export type variants =
  | "default"
  | "defaultPeek"
  | "primary"
  | "secondary"
  | "tertiary"
  | "tertiaryDimmed"
  | "minimal"
  | "accent"
  | "special";

export type colors =
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
export const colorsList = [
  "surface",
  "surface-alpha",
  "blue",
  "pink",
  "red",
  "orange",
  "green",
  "yellow",
  "purple",
  "cyber-green",
] as const;

export type sizes = "xxs" | "xs" | "s" | "m" | "l";

export const textStyleOptions = [
  "lineHeightAuto",
  "lineHeightBody",
  "fontSizeXXS",
  "fontSizeXS",
  "fontSizeS",
  "fontSizeM",
  "fontSizeL",
  "fontWeightRegular",
  "fontWeightMedium",
  "fontWeightSemiBold",
  "fontWeightBold",
  "fontFamilyInter",
  "fontFamilyHubot",
] as const;

// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
export type TextStyles = (typeof textStyleOptions)[number];

interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
  tooltipSide?: "bottom" | "left" | "right" | "top";
}

export interface PrimitiveComponentDefaultProps
  extends PropsWithChildren,
    TooltipWrapperProps {
  csColor?: colors;
  csVariant?: variants;
  csSize?: sizes;
  csTextStyles?: TextStyles[];
  rootClasses?: string;
}

export const TooltipWrapper = (props: TooltipWrapperProps) =>
  props.tooltipText ? (
    <Tooltip content={props.tooltipText} side={props.tooltipSide ?? "bottom"}>
      {props.children}
    </Tooltip>
  ) : (
    <>{props.children}</>
  );
