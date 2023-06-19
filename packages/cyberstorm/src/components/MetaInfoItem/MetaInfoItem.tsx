"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MetaInfoItem.module.css";

export type MetaInfoItemProps = {
  label?: string;
  content?: ReactNode;
  colorScheme?: "default" | "tertiary";
};
export const MetaInfoItem = React.forwardRef<HTMLDivElement, MetaInfoItemProps>(
  (props, forwardedRef) => {
    const {
      label,
      content,
      colorScheme = "default",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div
        {...forwardedProps}
        ref={ref}
        className={`${styles.root} ${getStyle(colorScheme)}`}
      >
        <div className={styles.label}>{label}</div>
        <div className={styles.content}>{content}</div>
      </div>
    );
  }
);

MetaInfoItem.displayName = "MetaInfoItem";

const getStyle = (scheme: MetaInfoItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaInfoItem__tertiary,
    default: styles.metaInfoItem__default,
  }[scheme];
};
