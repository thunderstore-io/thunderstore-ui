"use client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

interface CyberstormProvidersProps {
  children: ReactNode | ReactNode[];
}

export function CyberstormProviders(props: CyberstormProvidersProps) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      {props.children}
    </RadixTooltip.Provider>
  );
}
