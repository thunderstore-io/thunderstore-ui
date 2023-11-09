"use client";
import { Toast } from "../..";
import styles from "./Toast.module.css";

export function ToastContainer(props: {
  toasts: {
    id: string;
    variant?: "info" | "danger" | "warning" | "success";
    icon?: JSX.Element;
    message?: string;
    noTimer?: boolean;
  }[];
}) {
  const { toasts } = props;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          icon={toast.icon}
          content={toast.message}
          variant={toast.variant}
          noTimer={toast.noTimer}
        />
      ))}
    </div>
  );
}

ToastContainer.displayName = "ToastContainer";
