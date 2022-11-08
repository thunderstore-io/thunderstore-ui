import React, { MouseEventHandler, ReactNode } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  buttonStyle?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Cyberstorm Button component
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { label, leftIcon, rightIcon, buttonStyle, onClick } = props;
  styles; //if styles is not called, the classes from the css module aren't found
  const additionalStyle = buttonStyle
    ? " button__" + buttonStyle
    : " button__default";

  return (
    <button
      type="button"
      className={"button" + additionalStyle}
      onClick={onClick}
    >
      {leftIcon}
      {label ? <div className="buttonLabel">{label}</div> : null}
      {rightIcon}
    </button>
  );
};
