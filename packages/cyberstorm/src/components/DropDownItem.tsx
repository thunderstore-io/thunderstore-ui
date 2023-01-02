import React, { ReactNode } from "react";
import styles from "./componentStyles/DropDownItem.module.css";

export interface DropDownItemProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default";
}

/**
 * Cyberstorm DropDownItem component
 */
export const DropDownItem: React.FC<DropDownItemProps> = (props) => {
  const { label, leftIcon, rightIcon, colorScheme } = props;

  return (
    <div className={`${styles.root} ${getStyle(colorScheme)}`}>
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </div>
  );
};

DropDownItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: DropDownItemProps["colorScheme"] = "default") => {
  return {
    default: styles.dropDownItem__default,
    defaultDark: styles.dropDownItem__defaultDark,
    primary: styles.dropDownItem__primary,
  }[scheme];
};
