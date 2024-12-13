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

interface TextInputProps extends Omit<InputTextInputProps, "primitiveType"> {
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
          "ts-textinput__wrapper",
          ...componentClasses(csVariant, csSize, csModifiers),
          rootClasses
        )}
      >
        {leftIcon ? (
          <NewIcon
            csMode="inline"
            noWrapper
            rootClasses="ts-textinput__lefticon"
          >
            {leftIcon}
          </NewIcon>
        ) : null}
        <Input
          {...fProps}
          primitiveType={"textInput"}
          rootClasses={classnames(
            "ts-textinput",
            leftIcon ? "ts-textinput__haslefticon" : null,
            clearValue ? "ts-textinput__hasclearvalue" : null,
            ...componentClasses(csVariant, csSize, csModifiers)
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
              "ts-textinput__clearvaluebutton",
              ...componentClasses(csVariant, csSize, csModifiers)
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
