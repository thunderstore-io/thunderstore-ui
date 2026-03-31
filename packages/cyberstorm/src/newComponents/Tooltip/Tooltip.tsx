import { Arrow, Content, Portal, Root, Trigger } from "@radix-ui/react-tooltip";
import { type ReactNode, memo, useContext } from "react";

import { TopLayerContainerContext } from "../../utils/TopLayerContainerContext";
import "./Tooltip.css";

export interface TooltipProps {
  content?: string;
  sideOffset?: number;
  side?: "right" | "top" | "bottom" | "left" | undefined;
  collisionPadding?: number;
  sticky?: "always" | "partial" | undefined;
  avoidCollisions?: boolean;
  children?: ReactNode;
  open?: boolean;
}

export const Tooltip = memo(function Tooltip(props: TooltipProps) {
  const {
    content,
    sideOffset = 5,
    side = "right",
    collisionPadding = 20,
    sticky = "always",
    avoidCollisions = true,
    children,
    open,
  } = props;

  const container = useContext(TopLayerContainerContext);

  return (
    <Root open={open}>
      <Trigger asChild>{children}</Trigger>
      <Portal container={container ?? undefined}>
        <Content
          className="tooltip"
          sideOffset={sideOffset ? sideOffset : 5}
          side={side ? side : "right"}
          collisionPadding={collisionPadding ? collisionPadding : 20}
          sticky={sticky ? sticky : "always"}
          avoidCollisions={
            avoidCollisions !== undefined ? avoidCollisions : true
          }
        >
          {content}
          <Arrow className="__arrow" />
        </Content>
      </Portal>
    </Root>
  );
});
