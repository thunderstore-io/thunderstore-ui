import React, { MouseEventHandler } from "react";
import styles from "./componentStyles/Button.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: Element;
  rightIcon?: Element;
  buttonStyle?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Cyberstorm Button component
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const { label, leftIcon, rightIcon, buttonStyle, onClick } = props;
  const stylesImport = styles;
  const additionalStyle = buttonStyle ? " button__" + buttonStyle : "";

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
