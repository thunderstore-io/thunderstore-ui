import React, { ReactNode } from "react";
import styles from "./componentStyles/SelectItem.module.css";

export interface SelectItemProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default" | "defaultDark" | "primary";
}

/**
 * Cyberstorm SelectItem component
 */
export const SelectItem: React.FC<SelectItemProps> = React.forwardRef(
  (props, ref) => {
    const { label, leftIcon, rightIcon, colorScheme } = props;

    return (
      <div
        {...props}
        ref={ref}
        className={`${styles.root} ${getStyle(colorScheme)}`}
      >
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {leftIcon}
        </div>
        {label ? <div className={styles.label}>{label}</div> : null}
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {rightIcon}
        </div>
      </div>
    );
  }
);

SelectItem.displayName = "SelectItem";
SelectItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: SelectItemProps["colorScheme"] = "default") => {
  return {
    default: styles.selectItem__default,
    defaultDark: styles.selectItem__defaultDark,
    primary: styles.selectItem__primary,
  }[scheme];
};
