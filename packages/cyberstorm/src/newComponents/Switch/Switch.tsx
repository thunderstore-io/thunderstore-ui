import * as RadixSwitch from "@radix-ui/react-switch";
import React, { memo } from "react";

import {
  type SwitchModifiers,
  type SwitchSizes,
  type SwitchVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

import { classnames, componentClasses } from "../../utils/utils";
import "./Switch.css";

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
        ...componentClasses(
          "switch",
          csVariant,
          csSize,
          disabled ? [...(csModifiers ?? []), "disabled"] : csModifiers
        ),
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
