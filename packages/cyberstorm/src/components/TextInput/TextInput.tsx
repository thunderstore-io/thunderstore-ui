import React, { ReactNode } from "react";
import styles from "./TextInput.module.css";

export interface TextInputProps {
  placeHolder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Cyberstorm TextInput component
 */
export const TextInput: React.FC<TextInputProps> = (props) => {
  const { placeHolder, leftIcon, rightIcon } = props;

  return (
    <div className={styles.root}>
      {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
      <input type="text" placeholder={placeHolder} className={styles.input} />
      {rightIcon ? <div className={styles.rightIcon}>{rightIcon}</div> : null}
    </div>
  );
};

TextInput.displayName = "TextInput";
TextInput.defaultProps = {};