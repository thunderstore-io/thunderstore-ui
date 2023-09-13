"use client";
import React, { ReactNode } from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps {
  placeHolder?: string;
  leftIcon?: ReactNode;
  id?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  rightIcon?: ReactNode;
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
      {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
      <input
        id={id}
        type={type}
        placeholder={placeHolder}
        className={`${styles.input} ${leftIcon ? styles.hasLeftIcon : ""}`}
        onChange={(event) => setValue && setValue(event.target.value)}
        value={value}
        onKeyDown={(e) => onEnter(e)}
      />
      {rightIcon ? <div className={styles.rightIcon}>{rightIcon}</div> : null}
    </div>
  );
}

TextInput.displayName = "TextInput";
