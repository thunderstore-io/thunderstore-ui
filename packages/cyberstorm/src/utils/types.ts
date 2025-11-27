import { type ReactNode } from "react";

export type SelectOption<T> = {
  value: T;
  label?: string;
  leftIcon?: ReactNode;
};
