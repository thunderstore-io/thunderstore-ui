import "./Switch.css";
import React from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { classnames, componentClasses } from "../../utils/utils";
import {
  SwitchVariants,
  SwitchSizes,
  SwitchModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

export interface SwitchProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  id?: string;
  rootClasses?: string;
  csVariant?: SwitchVariants;
  csSize?: SwitchSizes;
  csModifiers?: SwitchModifiers[];
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      value,
      onChange,
      disabled = false,
      id,
      rootClasses,
      csVariant = "default",
      csSize = "medium",
      csModifiers,
    } = props;

    const handleChange = (checked: boolean) => {
      if (onChange) {
        onChange(checked);
      }
    };

    return (
      <RadixSwitch.Root
        className={classnames(
          "switch",
          ...componentClasses("switch", csVariant, csSize, csModifiers),
          rootClasses
        )}
        disabled={disabled}
        onCheckedChange={handleChange}
        checked={value}
        id={id}
        ref={ref}
      >
        <RadixSwitch.Thumb className="switch__thumb" />
      </RadixSwitch.Root>
    );
  }
);
