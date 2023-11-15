import { createContext, PropsWithChildren, useReducer } from "react";
import { v4 as uuid } from "uuid";
import * as RadixToast from "@radix-ui/react-toast";
import Toast from ".";
import { ToastProps } from "./Toast";

const initState: {
  toasts: ToastProps[];
} = { toasts: [] };

const toastReducer = (
  state: {
    toasts: ToastProps[];
  },
  action: {
    type: "add" | "delete";
    toast: ToastProps;
  }
) => {
  switch (action.type) {
    case "add": {
      return {
        toasts: [...state.toasts, action.toast],
      };
    }
    case "delete": {
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.toast.id
      );
      return {
        toasts: updatedToasts,
      };
    }
    default:
      throw new Error(`Unhandled action: ${action.type}`);
  }
};

interface ContextInterface {
  addToast: (props: Omit<ToastProps, "id">) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ContextInterface | null>(null);

export function Provider(props: { toastDuration: number } & PropsWithChildren) {
  const [state, dispatch] = useReducer(toastReducer, initState);

  const addToast = (props: Omit<ToastProps, "id">) => {
    const id = uuid();
    dispatch({ type: "add", toast: { id, ...props } });
  };

  const remove = (id: string) => {
    dispatch({ type: "delete", toast: { id } });
  };

  const value = {
    addToast,
    remove,
  };

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="left" duration={props.toastDuration}>
        {props.children}
        <Toast.Viewport toasts={state.toasts} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
