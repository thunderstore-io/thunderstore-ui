"use client";

import { useToast } from "@thunderstore/cyberstorm/src/components/Toast/Provider";

export type UseFormToasterArgs = {
  successMessage: string;
};
export type UseFormToasterReturn = {
  onSubmitSuccess: () => void;
  onSubmitError: () => void;
};
export function useFormToaster({
  successMessage,
}: UseFormToasterArgs): UseFormToasterReturn {
  const toast = useToast();

  return {
    onSubmitSuccess: () => {
      toast.addToast({
        variant: "success",
        message: successMessage,
        duration: 30000,
      });
    },
    onSubmitError: () => {
      // TODO: Display submit errors that server gives.
      toast.addToast({
        variant: "danger",
        message: "Unknown error occurred. The error has been logged",
      });
    },
  };
}
