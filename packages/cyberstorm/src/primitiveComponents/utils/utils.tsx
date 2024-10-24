import { PropsWithChildren } from "react";
import { Tooltip } from "../..";

interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
  tooltipSide?: "bottom" | "left" | "right" | "top";
}

export interface PrimitiveComponentDefaultProps
  extends PropsWithChildren,
    TooltipWrapperProps {
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
