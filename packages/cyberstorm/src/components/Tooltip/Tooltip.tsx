import { ReactNode } from "react";
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
}

// Cyberstorm Tooltip component

export function Tooltip({
  content,
  sideOffset = 5,
  side = "right",
  collisionPadding = 20,
  sticky = "always",
  avoidCollisions = true,
  children,
}: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className={styles.root}
          sideOffset={sideOffset}
          side={side}
          collisionPadding={collisionPadding}
          sticky={sticky}
          avoidCollisions={avoidCollisions}
        >
          {content}
          <RadixTooltip.Arrow className={styles.arrow} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
