"use client";

import React from "react";
import styles from "./Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";

// Replace buttons default value with a boolean, because this is a switch.

export const Switch = React.forwardRef<
  HTMLButtonElement,
  Omit<RadixSwitch.SwitchProps, "value">
>(function Switch(props, ref) {
  return (
    <RadixSwitch.Root className={styles.root} {...props} ref={ref}>
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
});
