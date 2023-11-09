import {
  ReactNode,
  createContext,
  PropsWithChildren,
  useState,
  useReducer,
} from "react";
import { ToastContainer } from "./ToastContainer";

const toastReducer = (
  state: { toasts: { id: string; type: string; message: string }[] },
  action: {
    type: string;
    message: string;
    payload: string;
  }
) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "DELETE_TOAST": {
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
      return {
        ...state,
        toasts: updatedToasts,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

interface ContextInterface {
  addToast: (type: string, message: string) => void;
  remove: (id: string) => void;
  clearToastContent: () => void;
  setToastContent: React.Dispatch<React.SetStateAction<ReactNode>>;
  toastContent: ReactNode;
}

export const ToastContext = createContext<ContextInterface | null>(null);

export function ToastProvider(props: PropsWithChildren) {
  const [toastContent, setToastContent] = useState<ReactNode>(null);

  const clearToastContent = () => {
    setToastContent(undefined);
  };

  const addToast = (type: string, message: string) => {
    const id = Math.floor(Math.random() * 10000000);
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
  };

  const remove = (id: string) => {
    dispatch({ type: "DELETE_TOAST", payload: id });
  };

  const value = {
    addToast,
    remove,
    clearToastContent,
    setToastContent,
    toastContent,
  };

  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer toasts={state.toasts} />
      {props.children}
    </ToastContext.Provider>
  );
}
