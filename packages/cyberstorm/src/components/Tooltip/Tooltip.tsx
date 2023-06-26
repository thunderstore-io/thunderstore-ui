"use client";
import { ReactNode, useState } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  content?: string;
  sideOffset?: number;
  side?: "right" | "top" | "bottom" | "left" | undefined;
  collisionPadding?: number;
  sticky?: "always" | "partial" | undefined;
  avoidCollisions?: boolean;
  children?: ReactNode;
  forceShow?: boolean;
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
  forceShow = false,
}: TooltipProps) {
  const [open, setOpen] = useState(forceShow);

  return (
    <RadixTooltip.Root onOpenChange={setOpen} open={forceShow || open}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
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
          <RadixTooltip.Arrow className={styles.arrow} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
