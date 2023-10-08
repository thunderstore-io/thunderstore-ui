"use client";

import { Dispatch, SetStateAction } from "react";
import styles from "./Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps {
  state: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  Id?: string;
}

export function Switch(props: SwitchProps) {
  const { state, onChange, disabled = false, Id } = props;
  return (
    <RadixSwitch.Root
      className={styles.root}
      disabled={disabled}
      onCheckedChange={onChange}
      checked={state}
      id={Id}
    >
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
}
