"use client";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { ToastProvider } from "./Toast/ToastContext";

interface CyberstormProvidersProps {
  children: ReactNode | ReactNode[];
}

export function CyberstormProviders(props: CyberstormProvidersProps) {
  return (
    <ToastProvider>
      <RadixTooltip.Provider delayDuration={80}>
        {props.children}
      </RadixTooltip.Provider>
    </ToastProvider>
  );
}
