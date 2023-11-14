"use client";
import { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

export interface DialogCloseProps extends RadixDialog.DialogCloseProps {
  children?: ReactNode;
}

/**
 * Cyberstorm Dialog Close Sub Component
 */
export function DialogClose(props: DialogCloseProps) {
  const { children, ...restOfProps } = props;

  return <RadixDialog.Close {...restOfProps}>{children}</RadixDialog.Close>;
}

DialogClose.displayName = "DialogClose";
