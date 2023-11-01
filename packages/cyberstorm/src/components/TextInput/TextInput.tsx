"use client";
import React from "react";
import styles from "./TextInput.module.css";
import { Icon } from "../Icon/Icon";

export interface TextInputProps {
  placeHolder?: string;
  leftIcon?: JSX.Element;
  id?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  rightIcon?: JSX.Element;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
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
    setValue,
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
        type={type}
        placeholder={placeHolder}
        className={`${styles.input} ${leftIcon ? styles.hasLeftIcon : ""}`}
        onChange={(event) => setValue && setValue(event.target.value)}
        value={value}
        onKeyDown={(e) => onEnter(e)}
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
