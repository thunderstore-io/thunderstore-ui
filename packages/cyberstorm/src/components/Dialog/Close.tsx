import { PropsWithChildren } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

/**
 * Cyberstorm Dialog Close Sub Component
 */
export function Close(props: PropsWithChildren & RadixDialog.DialogCloseProps) {
  const { children, ...restOfProps } = props;

  return <RadixDialog.Close {...restOfProps}>{children}</RadixDialog.Close>;
}
