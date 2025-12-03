import React from "react";

import styles from "./TextAreaInput.module.css";

export interface TextAreaInputProps {
  placeHolder?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  enterHook?: (value: string) => string | void;
}

/**
 * Cyberstorm TextAreaInput component
 */
export function TextAreaInput(props: TextAreaInputProps) {
  const { placeHolder, value = "", setValue, enterHook } = props;

  const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterHook && e.key === "Enter") {
      enterHook(value.toLowerCase());
    }
  };

  return (
    <textarea
      placeholder={placeHolder}
      className={styles.root}
      onChange={(event) => setValue && setValue(event.target.value)}
      value={value}
      onKeyDown={(e) => onEnter(e)}
    ></textarea>
  );
}

TextAreaInput.displayName = "TextAreaInput";
