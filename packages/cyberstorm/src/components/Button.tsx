import React, { MouseEventHandler } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  buttonStyle?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Generic Button component
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { label, leftIcon, rightIcon, buttonStyle, onClick } = props;
  const stylesImport = styles;

  return (
    <button className={"btn btn-" + buttonStyle} onClick={onClick}>
      {leftIcon}
      {label ? <div className="label">{label}</div> : null}
      {rightIcon}
    </button>
  );
};
