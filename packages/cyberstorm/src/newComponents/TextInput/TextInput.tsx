import "./TextInput.css";
import React from "react";
import {
  Input,
  InputTextInputProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import { NewIcon } from "../..";
import {
  TextInputVariants,
  TextInputSizes,
  TextInputModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

export interface TextInputProps
  extends Omit<InputTextInputProps, "primitiveType"> {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  enterHook?: (value: string | number | readonly string[]) => string | void;
  clearValue?: () => void;
  csVariant?: TextInputVariants;
  csSize?: TextInputSizes;
  csModifiers?: TextInputModifiers[];
}

// TODO: Finish the styles conversion to new system
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props: TextInputProps, forwardedRef) => {
    const {
      children,
      leftIcon,
      rightIcon,
      clearValue,
      enterHook,
      rootClasses,
      csVariant = "primary",
      csSize = "default",
      csModifiers,
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as InputTextInputProps;
    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (fProps.value && enterHook && e.key === "Enter") {
        enterHook(fProps.value);
      }
    };
    return (
      <Frame
        primitiveType="window"
        rootClasses={classnames(
          "text-input__wrapper",
          ...componentClasses(
            "text-input__wrapper",
            csVariant,
            csSize,
            csModifiers
          ),
          rootClasses
        )}
      >
        {leftIcon ? (
          <NewIcon
            csMode="inline"
            noWrapper
            rootClasses="text-input__left-icon"
          >
            {leftIcon}
          </NewIcon>
        ) : null}
        <Input
          {...fProps}
          primitiveType={"textInput"}
          rootClasses={classnames(
            "text-input",
            leftIcon ? "text-input--has-left-icon" : null,
            clearValue ? "text-input--has-clear-value" : null,
            ...componentClasses("text-input", csVariant, csSize, csModifiers)
          )}
          ref={forwardedRef}
          onKeyDown={onEnter}
        >
          {children}
        </Input>
        {clearValue && fProps.value !== "" ? (
          <Actionable
            primitiveType="button"
            onClick={() => clearValue()}
            rootClasses={classnames(
              "text-input__clear-value-button",
              ...componentClasses(
                "text-input__clear-value-button",
                csVariant,
                csSize,
                csModifiers
              )
            )}
            tooltipText="Clear"
            tooltipSide="left"
            aria-label="Clear search input"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faXmarkLarge} />
            </NewIcon>
          </Actionable>
        ) : null}
      </Frame>
    );
  }
);

TextInput.displayName = "TextInput";
