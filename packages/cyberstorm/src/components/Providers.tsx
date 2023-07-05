"use client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { PropsWithChildren } from "react";

export function CyberstormProviders(props: PropsWithChildren) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      {props.children}
    </RadixTooltip.Provider>
  );
}
