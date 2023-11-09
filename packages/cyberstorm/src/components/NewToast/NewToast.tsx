"use client";
import React, { ReactNode, useContext, useState } from "react";
import styles from "./NewToast.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { Button } from "../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { ToastContext } from "./NewToastContext";
import * as RadixToast from "@radix-ui/react-toast";

type _ToastProps = {
  id: string;
  content: ReactNode;
  icon?: JSX.Element;
  variant?: "info" | "danger" | "warning" | "success";
  noTimer?: boolean;
};
export type ToastProps = _ToastProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _ToastProps>;

export function Toast(props: ToastProps) {
  const { id, content, icon, variant = "info", noTimer = false } = props;
  const useToast = () => useContext(ToastContext);
  const toast = useToast();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  // Fade in
  setTimeout(() => setIsFadingIn(false), 300);

  const removeToast = () => {
    toast?.remove(id);
    setIsFadingOut(false);
  };
  const fadeOut = () => {
    setIsFadingOut(true);
    setTimeout(() => removeToast(), 300);
  };

  // Auto remove after 10 seconds
  if (!noTimer) {
    setTimeout(() => fadeOut(), 10000);
  }

  return (
    <RadixToast.Root asChild>
      <div
        className={classnames(
          styles.root,
          isFadingOut ? styles.rootFadeOut : null,
          isFadingIn ? styles.rootFadeIn : null
        )}
      >
        <div className={classnames(styles.contentWrapper, getStyle(variant))}>
          <RadixToast.Description asChild>
            <div className={styles.content}>
              <Icon wrapperClasses={styles.icon}>{icon}</Icon>
              <div className={styles.message}>{content}</div>
            </div>
          </RadixToast.Description>
          <div className={styles.toastProgress}>
            <div
              className={classnames(
                styles.toastProgressBar,
                noTimer ? null : styles.toastProgressBarTimer
              )}
            />
          </div>
          <RadixToast.Close asChild>
            <div
              className={classnames(styles.closeIcon, styles.closeIconWrapper)}
            >
              <Button.Root
                colorScheme="transparentNoBackground"
                paddingSize="none"
                onClick={fadeOut}
              >
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faXmarkLarge} />
                </Button.ButtonIcon>
              </Button.Root>
            </div>
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
