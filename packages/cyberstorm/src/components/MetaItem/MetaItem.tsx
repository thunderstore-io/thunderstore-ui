"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./MetaItem.module.css";

type _MetaItemProps = {
  label?: string;
  icon?: ReactNode;
  colorScheme?: "default" | "accent";
  size?: "medium" | "large";
  ref?: React.Ref<HTMLDivElement>;
};
export type MetaItemProps = _MetaItemProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _MetaItemProps>;

/**
 * Cyberstorm MetaItem component
 * Used for displaying a single data point (e.g. an amount
 * of likes or a size of a package) with an icon next to it
 */
export const MetaItem = React.forwardRef<HTMLDivElement, MetaItemProps>(
  (props, forwardedRef) => {
    const { label, icon, colorScheme = "default", size = "medium" } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div ref={ref} className={`${styles.root} ${getStyle(colorScheme)}`}>
        {icon}
        {label ? (
          <div className={`${styles.label} ${getSize(size)}`}>{label}</div>
        ) : null}
      </div>
    );
  }
);

MetaItem.displayName = "MetaItem";

const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
  return {
    accent: styles.metaItem__accent,
    default: styles.metaItem__default,
  }[scheme];
};

const getSize = (scheme: MetaItemProps["size"] = "medium") => {
  return {
    medium: styles.metaItem__medium,
    large: styles.metaItem__large,
  }[scheme];
};
