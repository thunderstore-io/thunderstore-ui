"use client";
import React, { ReactNode } from "react";
import styles from "./Toast.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { Button } from "../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";

type _ToastProps = {
  content: ReactNode;
  icon?: JSX.Element;
  variant?: "info" | "danger" | "warning" | "success";
};
export type ToastProps = _ToastProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _ToastProps>;

export function Toast(props: ToastProps) {
  const { content, icon, variant = "info" } = props;

  return (
    <div className={classnames(styles.root, getStyle(variant))}>
      <Icon wrapperClasses={styles.icon}>{icon}</Icon>
      <div className={styles.content}>{content}</div>
      <div className={styles.closeIconWrapper}>
        <Button.Root>
          <Button.ButtonIcon>
            <FontAwesomeIcon className={styles.closeIcon} icon={faXmarkLarge} />
          </Button.ButtonIcon>
        </Button.Root>
      </div>
    </div>
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
