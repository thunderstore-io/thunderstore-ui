import React, { ReactNode, useRef } from "react";
import styles from "./componentStyles/MenuItem.module.css";

export interface MenuItemProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default" | "defaultDark" | "primary";
}

/**
 * Cyberstorm MenuItem component
 */
export const MenuItem: React.FC<MenuItemProps> = React.forwardRef<
  HTMLDivElement,
  MenuItemProps
>((props, forwardedRef) => {
  const { label, leftIcon, rightIcon, colorScheme, ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={`${styles.root} ${getStyle(colorScheme)}`}
    >
      {leftIcon ? (
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {leftIcon}
        </div>
      ) : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? (
        <div className={`${styles.icon} ${getStyle(colorScheme)}`}>
          {rightIcon}
        </div>
      ) : null}
    </div>
  );
});

MenuItem.displayName = "MenuItem";
MenuItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: MenuItemProps["colorScheme"] = "default") => {
  return {
    default: styles.selectItem__default,
    defaultDark: styles.selectItem__defaultDark,
    primary: styles.selectItem__primary,
  }[scheme];
};
