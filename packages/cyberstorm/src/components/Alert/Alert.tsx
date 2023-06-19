"use client";
import React, { ReactNode, useRef } from "react";
import styles from "./Alert.module.css";

type _AlertProps = {
  label: string;
  icon?: ReactNode;
  variant?: "info" | "danger" | "warning" | "success";
  ref?: React.Ref<HTMLDivElement>;
};
export type AlertProps = _AlertProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _AlertProps>;

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, forwardedRef) => {
    const { label, icon, variant = "info" } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div ref={ref} className={`${styles.root} ${getStyle(variant)}`}>
        {<div className={`${styles.icon}`}>{icon}</div>}
        {<div className={`${styles.label}`}>{label}</div>}
      </div>
    );
  }
);

Alert.displayName = "Alert";

const getStyle = (scheme: AlertProps["variant"] = "info") => {
  return {
    info: styles.alert__info,
    danger: styles.alert__danger,
    warning: styles.alert__warning,
    success: styles.alert__success,
  }[scheme];
};
