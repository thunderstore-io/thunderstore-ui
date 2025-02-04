import { ReactNode } from "react";
import { Root, Trigger, Portal, Content, Arrow } from "@radix-ui/react-tooltip";

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

export function Tooltip(props: TooltipProps) {
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
  return (
    <Root open={open}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <Content
          className="ts-tooltip"
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
}
