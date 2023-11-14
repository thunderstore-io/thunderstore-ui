"use client";
import React, { CSSProperties, ReactNode } from "react";
import styles from "./Toast.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import * as RadixToast from "@radix-ui/react-toast";

type _ToastProps = {
  id: string;
  content: ReactNode;
  icon?: JSX.Element;
  variant?: "info" | "danger" | "warning" | "success";
  timer?: number;
};
export type ToastProps = _ToastProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _ToastProps>;

export function Toast(props: ToastProps) {
  const { content, icon, variant = "info", timer = 10000 } = props;
  const timerCSS = {
    "--bar-timer": `${timer / 1000}s`,
  } as CSSProperties;

  return (
    <RadixToast.Root asChild duration={timer}>
      <div className={classnames(styles.root)}>
        <div className={classnames(styles.contentWrapper, getStyle(variant))}>
          <RadixToast.Description asChild>
            <div className={styles.content}>
              <Icon wrapperClasses={styles.icon}>{icon}</Icon>
              <div className={styles.message}>{content}</div>
            </div>
          </RadixToast.Description>
          <div className={styles.toastProgress}>
            <div className={styles.toastProgressBar} style={timerCSS} />
          </div>
          <RadixToast.Close className={styles.closeIconWrapper}>
            <Icon iconClasses={styles.closeIcon}>
              <FontAwesomeIcon icon={faXmarkLarge} />
            </Icon>
          </RadixToast.Close>
        </div>
      </div>
    </RadixToast.Root>
  );
}

Toast.displayName = "Toast";

const getStyle = (scheme: ToastProps["variant"] = "info") => {
  return {
    info: styles.toast__info,
    danger: styles.toast__danger,
    warning: styles.toast__warning,
    success: styles.toast__success,
  }[scheme];
};
