import React, { ReactNode } from "react";
import styles from "./componentStyles/Tag.module.css";

export interface TagProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tagStyle?: "tag__default";
}

/**
 * Cyberstorm Tag component
 */
export const Tag: React.FC<TagProps> = (props) => {
  const { label, tagStyle, leftIcon, rightIcon } = props;

  return (
    <div
      /* TS is not aware of defaultProps of function components. */
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      className={`${styles.tag} ${styles[tagStyle!]}`}
    >
      <div className={styles.tagIcon}>{leftIcon}</div>
      {label ? <div className={styles.tagLabel}>{label}</div> : null}
      <div className={styles.tagIcon}>{rightIcon}</div>
    </div>
  );
};

Tag.defaultProps = { tagStyle: "tag__default" };
