import React, { ReactNode } from "react";
import styles from "./componentStyles/CustomSelectItem.module.css";

export interface SelectItemProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default" | "defaultDark" | "primary";
}

/**
 * Cyberstorm CustomSelectItem component
 */
export const CustomSelectItem: React.FC<SelectItemProps> = (props) => {
  const { label, leftIcon, rightIcon, colorScheme } = props;

  return (
    <div className={`${styles.root} ${getStyle(colorScheme)}`}>
      {leftIcon}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon}
    </div>
  );
};

CustomSelectItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: SelectItemProps["colorScheme"] = "default") => {
  return {
    default: styles.selectItem__default,
    defaultDark: styles.selectItem__defaultDark,
    primary: styles.selectItem__primary,
  }[scheme];
};
