"use client";
import React from "react";
import styles from "./TextInput.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface TextInputProps
  extends React.ComponentPropsWithoutRef<"input"> {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  color?: string;
  enterHook?: (value: string | number | readonly string[]) => string | void;
}

/**
 * Cyberstorm TextInput component
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(props, ref) {
    const {
      value = "",
      leftIcon,
      rightIcon,
      color,
      enterHook,
      ...elementProps
    } = props;
    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (enterHook && e.key === "Enter") {
        enterHook(value);
      }
    };

    return (
      <div className={styles.root}>
        {leftIcon ? (
          <Icon inline wrapperClasses={styles.leftIcon}>
            {leftIcon}
          </Icon>
        ) : null}
        <input
          {...elementProps}
          ref={ref}
          className={classnames(
            styles.input,
            leftIcon ? styles.hasLeftIcon : null
          )}
          value={value}
          onKeyDown={onEnter}
          data-color={color}
        />
        {rightIcon ? (
          <Icon inline wrapperClasses={styles.rightIcon}>
            {rightIcon}
          </Icon>
        ) : null}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
