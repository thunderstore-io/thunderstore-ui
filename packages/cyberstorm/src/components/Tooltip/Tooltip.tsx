import { ReactNode } from "react";
import { Root, Trigger, Portal, Content, Arrow } from "@radix-ui/react-tooltip";

import styles from "./Tooltip.module.css";

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

/**
 * Cyberstorm Tooltip Component
 */
export function Tooltip({
  content,
  sideOffset = 5,
  side = "right",
  collisionPadding = 20,
  sticky = "always",
  avoidCollisions = true,
  children,
  open,
}: TooltipProps) {
  return (
    <Root open={open}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <Content
          className={styles.root}
          sideOffset={sideOffset ? sideOffset : 5}
          side={side ? side : "right"}
          collisionPadding={collisionPadding ? collisionPadding : 20}
          sticky={sticky ? sticky : "always"}
          avoidCollisions={
            avoidCollisions !== undefined ? avoidCollisions : true
          }
        >
          {content}
          <Arrow className={styles.arrow} />
        </Content>
      </Portal>
    </Root>
  );
}
