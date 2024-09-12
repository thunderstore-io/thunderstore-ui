import React from "react";
import { PrimitiveComponentDefaultProps, TooltipWrapper } from "../utils/utils";
import { classnames } from "../../utils/utils";

export interface InputTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "textInput";
}

export const Input = React.forwardRef<HTMLInputElement, InputTextInputProps>(
  (props: InputTextInputProps, forwardedRef) => {
    const {
      children,
      primitiveType,
      rootClasses,
      csTextStyles,
      csColor,
      csVariant,
      csSize,
      tooltipText,
      tooltipSide,
      ...forwardedProps
    } = props;

    if (primitiveType === "textInput") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLInputElement>;
      const fProps = forwardedProps as InputTextInputProps;

      return (
        <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
          <input
            {...fProps}
            className={classnames(
              ...(csTextStyles ? csTextStyles : []),
              rootClasses
            )}
            data-color={csColor}
            data-variant={csVariant}
            data-size={csSize}
            ref={fRef}
          >
            {children}
          </input>
        </TooltipWrapper>
      );
    }
    return <p>Errored Input</p>;
  }
);

Input.displayName = "Input";
