import { PropsWithChildren } from "react";
import { Tooltip } from "../..";

export type variants =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
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
export type sizes = "xs" | "s" | "m" | "l";

const textStyleOptions = [
  "lineHeightAuto",
  "lineHeightBody",
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

export type TextStyles = typeof textStyleOptions[number];

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
