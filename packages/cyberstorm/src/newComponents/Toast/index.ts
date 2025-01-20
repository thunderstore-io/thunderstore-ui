import { Toast } from "./Toast";
import { Provider } from "./Provider";
import { Viewport } from "./Viewport";

export type { ToastProps } from "./Toast";
export default Object.assign(Toast, {
  Provider: Provider,
  Viewport: Viewport,
});
