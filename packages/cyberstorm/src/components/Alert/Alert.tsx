"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./Alert.module.css";

type _AlertProps = {
  label: string;
  icon?: ReactNode;
  colorScheme?: "blue" | "green" | "yellow" | "red";
  size?: "small" | "large";
  ref?: React.Ref<HTMLDivElement>;
};
export type AlertProps = _AlertProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _AlertProps>;

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, forwardedRef) => {
    const { label, icon, colorScheme = "blue", size = "small" } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div ref={ref} className={`${styles.root} ${getStyle(colorScheme)}`}>
        {icon}
        {<div className={`${styles.label} ${getSize(size)}`}>{label}</div>}
      </div>
    );
  }
);

Alert.displayName = "Alert";

const getStyle = (scheme: AlertProps["colorScheme"] = "blue") => {
  return {
    blue: styles.alert__blue,
    green: styles.alert__green,
    yellow: styles.alert__yellow,
    red: styles.alert__red,
  }[scheme];
};

const getSize = (scheme: AlertProps["size"] = "small") => {
  return {
    small: styles.alert__small,
    large: styles.alert__large,
  }[scheme];
};
