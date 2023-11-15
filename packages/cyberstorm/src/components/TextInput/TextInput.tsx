"use client";
import React from "react";
import styles from "./TextInput.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface TextInputProps
  extends React.ComponentPropsWithRef<"input">,
    React.PropsWithChildren {
  placeHolder?: string;
  leftIcon?: JSX.Element;
  id?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  rightIcon?: JSX.Element;
  value?: string;
  name?: string;
  color?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  enterHook?: (value: string) => string | void;
}

/**
 * Cyberstorm TextInput component
 */
export function TextInput(props: TextInputProps) {
  const {
    placeHolder,
    id,
    type = "text",
    leftIcon,
    rightIcon,
    value = "",
    name,
    color,
    ref,
    onBlur,
    onChange,
    enterHook,
  } = props;

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (enterHook && e.key === "Enter") {
      enterHook(value.toLowerCase());
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
        id={id}
        className={classnames(
          styles.input,
          leftIcon ? styles.hasLeftIcon : null
        )}
        type={type}
        placeholder={placeHolder}
        onBlur={onBlur}
        onChange={onChange}
        ref={ref}
        name={name}
        value={value}
        onKeyDown={(e) => onEnter(e)}
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

TextInput.displayName = "TextInput";
