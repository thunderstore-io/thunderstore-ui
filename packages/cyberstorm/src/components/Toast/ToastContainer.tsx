"use client";
import { Toast, ToastProps } from "../..";
import styles from "./Toast.module.css";

export function ToastContainer(props: { toasts: ToastProps[] }) {
  const { toasts } = props;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

ToastContainer.displayName = "ToastContainer";
