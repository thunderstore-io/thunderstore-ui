import { ReactNode } from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps {
  placeHolder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  value?: string;
}

/**
 * Cyberstorm TextInput component
 */
export function TextInput(props: TextInputProps) {
  const { placeHolder, leftIcon, rightIcon, value } = props;

  return (
    <div className={styles.root}>
      {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
      <input
        type="text"
        placeholder={placeHolder}
        className={`${styles.input} ${leftIcon ? styles.hasLeftIcon : ""}`}
        value={value}
      />
      {rightIcon ? <div className={styles.rightIcon}>{rightIcon}</div> : null}
    </div>
  );
}

TextInput.displayName = "TextInput";
