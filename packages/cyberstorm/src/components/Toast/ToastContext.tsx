import { createContext, PropsWithChildren, useReducer } from "react";
import { ToastContainer } from "./ToastContainer";
import { v4 as uuid } from "uuid";

const initState: {
  toasts: {
    id: string;
    variant?: "info" | "danger" | "warning" | "success";
    icon?: JSX.Element;
    message?: string;
    noTimer?: boolean;
  }[];
} = { toasts: [] };

const toastReducer = (
  state: {
    toasts: {
      id: string;
      variant?: "info" | "danger" | "warning" | "success";
      icon?: JSX.Element;
      message?: string;
      noTimer?: boolean;
    }[];
  },
  action: {
    type: "add" | "delete";
    toast: {
      id: string;
      variant?: "info" | "danger" | "warning" | "success";
      icon?: JSX.Element;
      message?: string;
      noTimer?: boolean;
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
    noTimer?: boolean
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
    noTimer?: boolean
  ) => {
    const id = uuid();
    dispatch({ type: "add", toast: { id, variant, icon, message, noTimer } });
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
      <ToastContainer toasts={state.toasts} />
      {props.children}
    </ToastContext.Provider>
  );
}
