import React from "react";
import { PrimitiveComponentDefaultProps, TooltipWrapper } from "../utils/utils";

export interface InputTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "textInput";
}

export interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    PrimitiveComponentDefaultProps {
  primitiveType: "textArea";
}

export const isRefType = (
  ref:
    | React.ForwardedRef<HTMLInputElement>
    | React.ForwardedRef<HTMLTextAreaElement>,
  wantedRef:
    | React.ForwardedRef<HTMLInputElement>
    | React.ForwardedRef<HTMLTextAreaElement>
): ref is typeof wantedRef => typeof ref === typeof wantedRef;

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputTextInputProps | InputTextAreaProps
>((props: InputTextInputProps | InputTextAreaProps, forwardedRef) => {
  const {
    children,
    primitiveType,
    rootClasses,
    tooltipText,
    tooltipSide,
    ...forwardedProps
  } = props;

  if (primitiveType === "textInput") {
    const fRef = forwardedRef as React.ForwardedRef<HTMLInputElement>;
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
    const fRef = forwardedRef as React.ForwardedRef<HTMLTextAreaElement>;
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
