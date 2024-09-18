import { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
const { Root, Trigger, Portal, Content, Arrow } = RadixTooltip;

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
