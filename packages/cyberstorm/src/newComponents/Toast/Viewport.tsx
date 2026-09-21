import * as RadixToast from "@radix-ui/react-toast";

import { Toast, type ToastProps } from "./Toast";
import "./Toast.css";

export function Viewport(props: { toasts: ToastProps[] }) {
  const { toasts } = props;

  return (
    <RadixToast.Viewport asChild>
      <div className="toast__viewport">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </RadixToast.Viewport>
  );
}
