import React, { ReactNode } from "react";
import styles from "./componentStyles/Tag.module.css";

export interface TagProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default";
  size?: "small" | "medium";
  isRemovable?: boolean;
}

/**
 * Cyberstorm Tag component
 */
export const Tag: React.FC<TagProps> = (props) => {
  const { label, colorScheme, leftIcon, rightIcon, size, isRemovable } = props;

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles[size!]} ${styles.root} ${getStyle(colorScheme)}
        ${isRemovable ? styles.tag__removable : null}
      `}
    >
      {leftIcon ? <div className={styles.icon}>{leftIcon}</div> : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? <div className={styles.icon}>{rightIcon}</div> : null}
    </div>
  );
};

Tag.defaultProps = { colorScheme: "default", size: "medium" };

const getStyle = (scheme: TagProps["colorScheme"] = "default") => {
  return {
    default: styles.tag__default,
  }[scheme];
};
