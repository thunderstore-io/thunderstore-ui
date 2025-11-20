import { memo, type ReactNode } from "react";
import { Provider } from "@radix-ui/react-tooltip";

export const TooltipProvider = memo(function TooltipProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <Provider delayDuration={80}>{children}</Provider>;
});
