import React, { useState } from "react";

import {
  Actionable,
  type ActionableButtonProps,
} from "../../primitiveComponents/Actionable/Actionable";
import { classnames } from "../../utils/utils";
import "./CycleButton.css";

interface CycleButtonProps
  extends Omit<ActionableButtonProps, "primitiveType"> {
  noState?: boolean;
  value?: string;
  onInteract?: () => void;
  options?: string[];
  onValueChange?: (value: string) => void;
}

/**
 * Button for cycling through values
 * If you want to handle state outside of this component use the "noState" param
 * Notes for handling state inside this component:
 * - First value of the list will be the initial value
 * - You can access the value from onValueChange. It's called each time value changes.
 */
export const CycleButton = React.forwardRef<
  HTMLButtonElement,
  CycleButtonProps
>((props: CycleButtonProps, forwardedRef) => {
  const {
    children,
    rootClasses,
    noState = false,
    onInteract,
    options,
    onValueChange,
    ...forwardedProps
  } = props;

  if (noState) {
    return (
      <Actionable
        {...forwardedProps}
        primitiveType={"button"}
        rootClasses={classnames("cycle-button", rootClasses)}
        ref={forwardedRef}
        onClick={onInteract ? () => onInteract() : undefined}
      >
        {children}
      </Actionable>
    );
  }

  const initialValue = options && options.length > 0 ? options[0] : "";
  const [currentValue, setCurrentValue] = useState<string>(initialValue);

  return (
    <Actionable
      {...forwardedProps}
      primitiveType={"button"}
      rootClasses={classnames("cycle-button", rootClasses)}
      ref={forwardedRef}
      onClick={() => {
        let newValue = currentValue;
        if (options && options.length > 0) {
          const currentValueIndex = options?.indexOf(currentValue);
          if (
            currentValueIndex === -1 ||
            currentValueIndex === options.length - 1
          ) {
            newValue = options[0];
          } else {
            newValue = options[currentValueIndex + 1];
          }
        }
        setCurrentValue(newValue);
        if (onInteract) {
          onInteract();
        }
        if (onValueChange) {
          onValueChange(newValue);
        }
      }}
    >
      {children}
    </Actionable>
  );
});

CycleButton.displayName = "CycleButton";
