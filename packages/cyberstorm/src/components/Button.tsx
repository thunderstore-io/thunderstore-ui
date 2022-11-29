import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  buttonStyle:
    | "danger"
    | "default"
    | "defaultDark"
    | "defaultWithBorder"
    | "primary"
    | "specialGreen"
    | "specialPurple";
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
      className={`${styles.root} ${getStyle(buttonStyle)}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </button>
  );
};

Button.defaultProps = { buttonStyle: "default" };

function getStyle(style: string) {
  switch (style) {
    case "defaultDark":
      return styles.button__defaultDark;
    case "primary":
      return styles.button__primary;
    case "danger":
      return styles.button__danger;
    case "defaultWithBorder":
      return styles.button__defaultWithBorder;
    case "specialGreen":
      return styles.button__specialGreen;
    case "specialPurple":
      return styles.button__specialPurple;
    case "default":
    default:
      return styles.button__default;
  }
}
