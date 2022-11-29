import React, { ReactNode } from "react";
import styles from "./componentStyles/Tag.module.css";

export interface TagProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tagStyle: "default";
  tagSize?: "small" | "medium" | "large";
}

/**
 * Cyberstorm Tag component
 */
export const Tag: React.FC<TagProps> = (props) => {
  const { label, tagStyle, leftIcon, rightIcon, tagSize } = props;

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.root} ${getStyle(tagStyle)} ${styles[tagSize!]}`}
    >
      <div className={styles.icon}>{leftIcon}</div>
      {label ? <div className={styles.label}>{label}</div> : null}
      <div className={styles.icon}>{rightIcon}</div>
    </div>
  );
};

Tag.defaultProps = { tagStyle: "default", tagSize: "medium" };

function getStyle(style: string) {
  switch (style) {
    case "default":
    default:
      return styles.tag__default;
  }
}
