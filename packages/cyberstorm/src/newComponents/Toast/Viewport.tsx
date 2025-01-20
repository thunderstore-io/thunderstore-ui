import { Toast, ToastProps } from "./Toast";
import "./Toast.css";
import * as RadixToast from "@radix-ui/react-toast";

export function Viewport(props: { toasts: ToastProps[] }) {
  const { toasts } = props;

  return (
    <RadixToast.Viewport asChild>
      <div className="ts-toast__viewport">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </RadixToast.Viewport>
  );
}
