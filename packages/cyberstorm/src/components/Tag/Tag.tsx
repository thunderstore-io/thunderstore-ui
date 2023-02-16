import React, { ReactNode, useRef } from "react";
import styles from "./Tag.module.css";

export interface TagProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  colorScheme?: "default";
  size?: "small" | "medium";
  isRemovable?: boolean;
}

/**
 * Cyberstorm Title component
 */
export const Tag: React.FC<TagProps> = React.forwardRef<
  HTMLDivElement,
  TagProps
>((props, forwardedRef) => {
  const {
    label,
    colorScheme,
    leftIcon,
    rightIcon,
    size,
    isRemovable,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={`${getSize(size)} ${styles.root} ${getStyle(colorScheme)}
        ${isRemovable ? styles.tag__removable : null}
      `}
    >
      {leftIcon ? <div className={styles.icon}>{leftIcon}</div> : null}
      {label ? <div className={styles.label}>{label}</div> : null}
      {rightIcon ? <div className={styles.icon}>{rightIcon}</div> : null}
    </div>
  );
});

Tag.displayName = "Tag";
Tag.defaultProps = { colorScheme: "default", size: "medium" };

const getStyle = (scheme: TagProps["colorScheme"] = "default") => {
  return {
    default: styles.tag__default,
  }[scheme];
};

const getSize = (scheme: TagProps["size"] = "medium") => {
  return {
    small: styles.small,
    medium: styles.medium,
  }[scheme];
};
