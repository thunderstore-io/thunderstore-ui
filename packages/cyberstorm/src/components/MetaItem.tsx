import React, { ReactNode, useRef } from "react";
import styles from "./componentStyles/MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  colorScheme?: "default" | "tertiary";
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
  const { label, icon, colorScheme } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div ref={ref} className={`${styles.root} ${getStyle(colorScheme)}`}>
      {icon}
      {label ? <div className={styles.label}>{label}</div> : null}
    </div>
  );
});

MetaItem.displayName = "MetaItem";
MetaItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaItem__tertiary,
    default: styles.metaItem__default,
  }[scheme];
};
