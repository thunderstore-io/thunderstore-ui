import React, { ReactNode } from "react";
import styles from "./MetaInfoItem.module.css";

export type MetaInfoItemProps = {
  label?: string;
  content?: ReactNode;
  colorScheme?: "default" | "tertiary";
};
export const MetaInfoItem = React.forwardRef<HTMLDivElement, MetaInfoItemProps>(
  (props) => {
    const { label, content, colorScheme } = props;

    return (
      <div className={`${styles.root} ${getStyle(colorScheme)}`}>
        <div>{label}</div>
        <div className={styles.content}>{content}</div>
      </div>
    );
  }
);

MetaInfoItem.displayName = "MetaInfoItem";
MetaInfoItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: MetaInfoItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaInfoItem__tertiary,
    default: styles.metaInfoItem__default,
  }[scheme];
};
