"use client";
import { Toast, ToastProps } from "./Toast";
import styles from "./Toast.module.css";
import * as RadixToast from "@radix-ui/react-toast";

export function Viewport(props: { toasts: ToastProps[] }) {
  const { toasts } = props;

  return (
    <RadixToast.Viewport asChild>
      <div className={styles.viewport}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </RadixToast.Viewport>
  );
}
