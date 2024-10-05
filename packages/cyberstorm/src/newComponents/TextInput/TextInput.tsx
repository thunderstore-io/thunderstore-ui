import styles from "./TextInput.module.css";
import React from "react";
import {
  Input,
  InputTextInputProps,
} from "../../primitiveComponents/Input/Input";
import { classnames } from "../../utils/utils";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import { colors, variants } from "../../primitiveComponents/utils/utils";
import { NewIcon } from "../..";

interface TextInputProps extends Omit<InputTextInputProps, "primitiveType"> {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  enterHook?: (value: string | number | readonly string[]) => string | void;
  clearValue?: () => void;
  wrapperColor?: colors;
  wrapperVariant?: variants;
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
      wrapperColor = "purple",
      wrapperVariant = "tertiary",
      rootClasses,
      csColor = "purple",
      csSize = "m",
      csVariant = "primary",
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
        rootClasses={classnames(styles.wrapper, rootClasses)}
        csColor={wrapperColor}
        csVariant={wrapperVariant}
        csTextStyles={["lineHeightAuto", "fontWeightRegular", "fontSizeM"]}
      >
        {leftIcon ? (
          <NewIcon
            csMode="inline"
            noWrapper
            rootClasses={styles.leftIcon}
            csTextStyles={["fontWeightRegular"]}
          >
            {leftIcon}
          </NewIcon>
        ) : null}
        <Input
          {...fProps}
          primitiveType={"textInput"}
          rootClasses={classnames(
            styles.textInput,
            leftIcon ? styles.hasLeftIcon : null,
            clearValue ? styles.hasClearValue : null
          )}
          csColor={csColor}
          csSize={csSize}
          csVariant={csVariant}
          csTextStyles={["fontSizeM", "fontWeightRegular"]}
          ref={forwardedRef}
          onKeyDown={onEnter}
        >
          {children}
        </Input>
        {clearValue && fProps.value !== "" ? (
          <Actionable
            primitiveType="button"
            onClick={() => clearValue()}
            rootClasses={styles.clearValueButton}
            tooltipText="Clear"
            tooltipSide="left"
            csColor={csColor}
            csVariant={"default"}
            aria-label="Clear search input"
          >
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCircleXmark} />
            </NewIcon>
          </Actionable>
        ) : null}
      </Frame>
    );
  }
);

TextInput.displayName = "TextInput";
