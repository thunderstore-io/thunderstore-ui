"use client";
import { Provider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import Toast from "../newComponents/Toast";

interface CyberstormProvidersProps {
  children: ReactNode | ReactNode[];
  tooltipDelay?: number;
  toastDuration?: number;
}

export function CyberstormProviders(props: CyberstormProvidersProps) {
  return (
    <Toast.Provider toastDuration={props.toastDuration ?? 10000}>
      <Provider delayDuration={props.tooltipDelay ?? 300}>
        {props.children}
      </Provider>
    </Toast.Provider>
  );
}
