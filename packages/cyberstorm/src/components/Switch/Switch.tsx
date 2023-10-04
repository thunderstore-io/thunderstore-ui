"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps {
  state: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  labelId?: string;
}

export function Switch(props: SwitchProps) {
  const { state, onChange, disabled = false, labelId } = props;
  return (
    <RadixSwitch.Root
      className={styles.root}
      disabled={disabled}
      onCheckedChange={onChange}
      checked={state}
      id={labelId}
    >
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
}
