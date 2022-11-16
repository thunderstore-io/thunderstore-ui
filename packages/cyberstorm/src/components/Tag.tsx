import React, { ReactNode } from "react";
import styles from "./componentStyles/Tag.module.css";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tagStyle?: string;
}

/**
 * Cyberstorm Tag component
 */
export const Tag: React.FC<ButtonProps> = (props) => {
  const { label, tagStyle, leftIcon, rightIcon } = props;
  styles; //if styles is not called, the classes from the css module aren't found
  const additionalStyle = tagStyle ? " tag__" + tagStyle : " tag__default";

  return (
    <div className={"tag" + additionalStyle}>
      {leftIcon}
      {label ? <div className="tagLabel">{label}</div> : null}
      {rightIcon}
    </div>
  );
};
