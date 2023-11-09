"use client";
import { Toast } from "./Toast";
import styles from "./Toast.module.css";
import * as RadixToast from "@radix-ui/react-toast";

export function ToastContainer(props: {
  toasts: {
    id: string;
    variant?: "info" | "danger" | "warning" | "success";
    icon?: JSX.Element;
    message?: string;
    timer?: number;
  }[];
}) {
  const { toasts } = props;

  return (
    <RadixToast.Viewport asChild>
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            icon={toast.icon}
            content={toast.message}
            variant={toast.variant}
            timer={toast.timer}
          />
        ))}
      </div>
    </RadixToast.Viewport>
  );
}

ToastContainer.displayName = "ToastContainer";
