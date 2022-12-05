import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?:
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
  const { label, leftIcon, rightIcon, colorScheme, onClick } = props;

  return (
    <button
      type="button"
      className={`${styles.root} ${getStyle(colorScheme)}`}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </button>
  );
};

Button.defaultProps = {};

const getStyle = (scheme: ButtonProps["colorScheme"] = "default") => {
  return {
    danger: styles.button__danger,
    default: styles.button__default,
    defaultDark: styles.button__defaultDark,
    defaultWithBorder: styles.button__defaultWithBorder,
    primary: styles.button__primary,
    specialGreen: styles.button__specialGreen,
    specialPurple: styles.button__specialPurple,
  }[scheme];
};
