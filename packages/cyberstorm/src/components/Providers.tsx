"use client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import Toast from "./Toast";

interface CyberstormProvidersProps {
  children: ReactNode | ReactNode[];
  tooltipDelay?: number;
  toastDuration?: number;
}

export function CyberstormProviders(props: CyberstormProvidersProps) {
  return (
    <Toast.Provider toastDuration={props.toastDuration ?? 10000}>
      <RadixTooltip.Provider delayDuration={props.tooltipDelay ?? 300}>
        {props.children}
      </RadixTooltip.Provider>
    </Toast.Provider>
  );
}
