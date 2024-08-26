import React, { CSSProperties, ReactNode } from "react";
import styles from "./Toast.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faBomb,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import * as RadixToast from "@radix-ui/react-toast";

export type ToastProps = {
  id: string;
  variant?: "info" | "danger" | "warning" | "success";
  message?: ReactNode;
  duration?: number;
};

type Props = ToastProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof ToastProps>;

export function Toast(props: Props) {
  const { message, variant = "info", duration = 10000 } = props;
  const durationCSS = {
    "--bar-duration": `${duration / 1000}s`,
  } as CSSProperties;
  return (
    <RadixToast.Root asChild duration={duration}>
      <div className={classnames(styles.root)}>
        <div className={classnames(styles.contentWrapper, getStyle(variant))}>
          <RadixToast.Description asChild>
            <div className={styles.content}>
              <Icon wrapperClasses={styles.icon}>{getIcon(variant)}</Icon>
              <div className={styles.message}>{message}</div>
            </div>
          </RadixToast.Description>
          <div className={styles.progress}>
            <div className={styles.progressBar} style={durationCSS} />
          </div>
          <RadixToast.Close
            className={styles.closeIconWrapper}
            aria-label="Close"
          >
            <Icon iconClasses={styles.closeIcon} inline>
              <FontAwesomeIcon icon={faXmark} />
            </Icon>
          </RadixToast.Close>
        </div>
      </div>
    </RadixToast.Root>
  );
}

const getStyle = (scheme: Props["variant"] = "info") => {
  return {
    info: styles.toast__info,
    danger: styles.toast__danger,
    warning: styles.toast__warning,
    success: styles.toast__success,
  }[scheme];
};

const getIcon = (scheme: Props["variant"] = "info") => {
  return {
    info: <FontAwesomeIcon icon={faCircleExclamation} />,
    danger: <FontAwesomeIcon icon={faBomb} />,
    warning: <FontAwesomeIcon icon={faTriangleExclamation} />,
    success: <FontAwesomeIcon icon={faCircleCheck} />,
  }[scheme];
};
