import { type ReactNode } from "react";

export type SelectOption<T extends string = string> = {
  value: T;
  label?: string;
  leftIcon?: ReactNode;
};
