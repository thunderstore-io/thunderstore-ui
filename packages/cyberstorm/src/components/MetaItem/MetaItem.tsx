import React, { ReactNode, useRef } from "react";
import styles from "./MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  colorScheme?: "default" | "tertiary";
  size?: "medium" | "large";
}

/**
 * Cyberstorm MetaItem component
 * Used for displaying a single data point (e.g. an amount
 * of likes or a size of a package) with an icon next to it
 */
export const MetaItem: React.FC<MetaItemProps> = React.forwardRef<
  HTMLDivElement,
  MetaItemProps
>((props, forwardedRef) => {
  const { label, icon, colorScheme, size } = props;

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
});

MetaItem.displayName = "MetaItem";
MetaItem.defaultProps = { colorScheme: "default", size: "medium" };

const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaItem__tertiary,
    default: styles.metaItem__default,
  }[scheme];
};

const getSize = (scheme: MetaItemProps["size"] = "medium") => {
  return {
    medium: styles.metaItem__medium,
    large: styles.metaItem__large,
  }[scheme];
};
