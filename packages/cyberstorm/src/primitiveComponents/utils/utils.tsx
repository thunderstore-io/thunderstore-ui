import { memo, type PropsWithChildren } from "react";
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

export const TooltipWrapper = memo(function TooltipWrapper(
  props: TooltipWrapperProps
) {
  if (!props.tooltipText) return <>{props.children}</>;
  return (
    <Tooltip content={props.tooltipText} side={props.tooltipSide ?? "bottom"}>
      {props.children}
    </Tooltip>
  );
});
