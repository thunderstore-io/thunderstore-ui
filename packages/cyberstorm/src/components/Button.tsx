import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  buttonStyle?:
    | "button__danger"
    | "button__default"
    | "button__defaultDark"
    | "button__defaultWithBorder"
    | "button__primary"
    | "button__specialGreen"
    | "button__specialPurple";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Cyberstorm Button component
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { label, leftIcon, rightIcon, buttonStyle, onClick } = props;

  return (
    <button
      type="button"
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.button} ${styles[buttonStyle!]}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.buttonLabel}>{label}</div> : null}
      {rightIcon}
    </button>
  );
};

Button.defaultProps = { buttonStyle: "button__default" };
