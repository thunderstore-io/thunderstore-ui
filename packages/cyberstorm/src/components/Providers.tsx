import * as RadixTooltip from "@radix-ui/react-tooltip";
import { FC, PropsWithChildren, ReactNode } from "react";

export const CyberstormProviders: FC<PropsWithChildren<ReactNode>> = (
  props
) => (
  <RadixTooltip.Provider delayDuration={150}>
    {props.children}
  </RadixTooltip.Provider>
);
