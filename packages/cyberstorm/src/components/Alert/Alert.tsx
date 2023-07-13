"use client";
import React, { ReactNode } from "react";
import styles from "./Alert.module.css";

type _AlertProps = {
  content: ReactNode;
  icon?: ReactNode;
  variant?: "info" | "danger" | "warning" | "success";
};
export type AlertProps = _AlertProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _AlertProps>;

export function Alert(props: AlertProps) {
  const { content, icon, variant = "info" } = props;

  return (
    <div className={`${styles.root} ${getStyle(variant)}`}>
      {<div className={`${styles.icon}`}>{icon}</div>}
      {<div className={`${styles.content}`}>{content}</div>}
    </div>
  );
}

Alert.displayName = "Alert";

const getStyle = (scheme: AlertProps["variant"] = "info") => {
  return {
    info: styles.alert__info,
    danger: styles.alert__danger,
    warning: styles.alert__warning,
    success: styles.alert__success,
  }[scheme];
};
