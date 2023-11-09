import { createContext, PropsWithChildren, useReducer } from "react";
import { ToastContainer } from "./NewToastContainer";
import { v4 as uuid } from "uuid";
import * as RadixToast from "@radix-ui/react-toast";

const initState: {
  toasts: {
    id: string;
    variant?: "info" | "danger" | "warning" | "success";
    icon?: JSX.Element;
    message?: string;
    timer?: number;
  }[];
} = { toasts: [] };

const toastReducer = (
  state: {
    toasts: {
      id: string;
      variant?: "info" | "danger" | "warning" | "success";
      icon?: JSX.Element;
      message?: string;
      timer?: number;
    }[];
  },
  action: {
    type: "add" | "delete";
    toast: {
      id: string;
      variant?: "info" | "danger" | "warning" | "success";
      icon?: JSX.Element;
      message?: string;
      timer?: number;
    };
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
  addToast: (
    variant?: "info" | "danger" | "warning" | "success",
    icon?: JSX.Element,
    message?: string,
    timer?: number
  ) => void;
  remove: (id: string) => void;
}

export const ToastContext = createContext<ContextInterface | null>(null);

export function ToastProvider(props: PropsWithChildren) {
  const [state, dispatch] = useReducer(toastReducer, initState);

  const addToast = (
    variant?: "info" | "danger" | "warning" | "success",
    icon?: JSX.Element,
    message?: string,
    timer?: number
  ) => {
    const id = uuid();
    dispatch({ type: "add", toast: { id, variant, icon, message, timer } });
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
      <RadixToast.Provider swipeDirection="left" duration={10000}>
        {props.children}
        <ToastContainer toasts={state.toasts} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
