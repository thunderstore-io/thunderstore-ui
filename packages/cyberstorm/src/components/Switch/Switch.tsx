import { Dispatch, SetStateAction } from "react";
import styles from "./Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";
import React from "react";

export interface SwitchProps {
  value: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  id?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(props, ref) {
    const { value, onChange, disabled = false, id } = props;
    return (
      <RadixSwitch.Root
        className={styles.root}
        disabled={disabled}
        onCheckedChange={onChange}
        checked={value}
        id={id}
        ref={ref}
      >
        <RadixSwitch.Thumb className={styles.thumb} />
      </RadixSwitch.Root>
    );
  }
);
