import React, { PropsWithChildren, useCallback } from "react";
import styles from "./componentStyles/Switch.module.css";
import * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps {
  state: boolean;
  switchCallback?: (state: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<PropsWithChildren<SwitchProps>> = ({
  state,
  switchCallback = undefined,
  disabled = false,
}) => {
  const onCheckedChange = useCallback(() => {
    if (switchCallback) {
      switchCallback(!state);
    }
  }, [state, switchCallback]);

  return (
    <RadixSwitch.Root
      className={styles.Switch}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      checked={state}
    >
      <RadixSwitch.Thumb className={styles.Thumb} />
    </RadixSwitch.Root>
  );
};
