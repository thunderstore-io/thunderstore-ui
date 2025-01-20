import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";

export type UseFormToasterArgs = {
  successMessage: string;
  errorMessage?: string;
};
export type UseFormToasterReturn = {
  onSubmitSuccess: () => void;
  onSubmitError: () => void;
};
export function useFormToaster({
  successMessage,
  errorMessage,
}: UseFormToasterArgs): UseFormToasterReturn {
  const toast = useToast();

  return {
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: successMessage,
        duration: 30000,
      });
    },
    onSubmitError: () => {
      toast.addToast({
        csVariant: "danger",
        children: errorMessage
          ? errorMessage
          : "Unknown error occurred. The error has been logged",
      });
    },
  };
}
