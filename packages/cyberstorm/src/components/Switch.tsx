import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";
import styles from "./componentStyles/Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps {
  state: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

export const Switch: React.FC<PropsWithChildren<SwitchProps>> = ({
  state,
  onChange,
  disabled = false,
}) => {
  return (
    <RadixSwitch.Root
      className={styles.root}
      disabled={disabled}
      onCheckedChange={onChange}
      checked={state}
    >
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );
};
