import * as RadixTooltip from "@radix-ui/react-tooltip";
import { PropsWithChildren, ReactNode } from "react";

export function CyberstormProviders(props: PropsWithChildren<ReactNode>) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      {props.children}
    </RadixTooltip.Provider>
  );
}
