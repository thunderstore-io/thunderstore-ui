import { PropsWithChildren } from "react";
import React from "react";
import { Tooltip } from "../../components/Tooltip/Tooltip";

export type variants =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "special";
export type colors =
  | "surface"
  | "surface-alpha"
  | "blue"
  | "pink"
  | "red"
  | "orange"
  | "green"
  | "yellow"
  | "purple"
  | "cyber-green";
type sizes = "xs" | "s" | "m" | "l";
type modes = "auto" | "body";
type weights = "regular" | "medium" | "semiBold" | "bold";

export interface InputDefaultProps extends PropsWithChildren {
  csColor?: colors;
  csSize?: sizes;
  csVariant?: variants;
  csMode?: modes;
  csWeight?: weights;
  rootClasses?: string;
  tooltipText?: string;
}

export interface InputTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    InputDefaultProps {
  primitiveType: "textInput";
}

interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
}

const TooltipWrapper = (props: TooltipWrapperProps) =>
  props.tooltipText ? (
    <Tooltip content={props.tooltipText} side="bottom">
      {props.children}
    </Tooltip>
  ) : (
    <>{props.children}</>
  );

export const Input = React.forwardRef<HTMLInputElement, InputTextInputProps>(
  (props: InputTextInputProps, forwardedRef) => {
    const {
      children,
      primitiveType,
      rootClasses,
      csColor,
      csSize,
      csVariant,
      csMode,
      csWeight,
      tooltipText,
      ...forwardedProps
    } = props;

    if (primitiveType === "textInput") {
      const fRef = forwardedRef as React.ForwardedRef<HTMLInputElement>;
      const fProps = forwardedProps as InputTextInputProps;

      return (
        <TooltipWrapper tooltipText={tooltipText}>
          <input
            {...fProps}
            className={rootClasses}
            data-color={csColor}
            data-size={csSize}
            data-variant={csVariant}
            data-mode={csMode}
            data-weight={csWeight}
            ref={fRef}
          >
            {children}
          </input>
        </TooltipWrapper>
      );
    }
    // if (primitiveType === "link") {
    //   const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
    //   const fProps = forwardedProps as InputLinkProps;
    //   return (
    //     <TooltipWrapper tooltipText={tooltipText}>
    //       <a
    //         {...fProps}
    //         className={rootClasses}
    //         data-color={csColor}
    //         data-size={csSize}
    //         data-variant={csVariant}
    //         data-mode={csMode}
    //         data-weight={csWeight}
    //         ref={fRef}
    //       >
    //         {children}
    //       </a>
    //     </TooltipWrapper>
    //   );
    // }
    return <p>Errored Input</p>;
  }
);

Input.displayName = "Input";
