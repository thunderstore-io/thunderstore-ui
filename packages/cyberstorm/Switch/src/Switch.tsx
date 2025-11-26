import "./Switch.css";
import React, { memo } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { classnames, componentClasses } from "@thunderstore/cyberstorm-utils";
import {
  type SwitchVariants,
  type SwitchSizes,
  type SwitchModifiers,
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
  ref?: React.Ref<HTMLButtonElement>;
}

export const Switch = memo(function Switch(props: SwitchProps) {
  const {
    value,
    onChange,
    disabled = false,
    id,
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    csModifiers,
    ref,
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
      <RadixSwitch.Thumb className="switch__knob" />
    </RadixSwitch.Root>
  );
});
