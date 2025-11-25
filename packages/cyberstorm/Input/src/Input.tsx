import React, { memo } from "react";
import {
  type PrimitiveComponentDefaultProps,
  TooltipWrapper,
} from "@thunderstore/cyberstorm-primitive-utils";

export interface InputTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "textInput";
  ref?: React.Ref<HTMLInputElement>;
}

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "textArea";
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Input = memo(function Input(
  props: InputTextInputProps | InputTextAreaProps
) {
  const {
    children,
    primitiveType,
    rootClasses,
    tooltipText,
    tooltipSide,
    ref,
    ...forwardedProps
  } = props;

  if (primitiveType === "textInput") {
    const fRef = ref as React.ForwardedRef<HTMLInputElement>;
    const fProps = forwardedProps as InputTextInputProps;

    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <input {...fProps} className={rootClasses} ref={fRef}>
          {children}
        </input>
      </TooltipWrapper>
    );
  }

  if (primitiveType === "textArea") {
    const fRef = ref as React.ForwardedRef<HTMLTextAreaElement>;
    const fProps = forwardedProps as InputTextAreaProps;

    return (
      <TooltipWrapper tooltipText={tooltipText} tooltipSide={tooltipSide}>
        <textarea {...fProps} className={rootClasses} ref={fRef}>
          {children}
        </textarea>
      </TooltipWrapper>
    );
  }
  return <p>Errored Input</p>;
});

Input.displayName = "Input";
