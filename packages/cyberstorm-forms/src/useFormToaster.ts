import { useToast } from "@thunderstore/cyberstorm";

export type UseFormToasterArgs<OnSubmitSuccessDataType, OnSubmitErrorDataType> =
  {
    successMessage: ((props: OnSubmitSuccessDataType) => string) | string;
    errorMessage?: ((props: OnSubmitErrorDataType) => string) | string;
    duration?: number;
  };
export type UseFormToasterReturn<
  OnSubmitSuccessDataType,
  OnSubmitErrorDataType,
> = {
  onSubmitSuccess: (props?: OnSubmitSuccessDataType) => void;
  onSubmitError: (props?: OnSubmitErrorDataType) => void;
  duration?: number;
};
export function useFormToaster<OnSubmitSuccessDataType, OnSubmitErrorDataType>({
  successMessage,
  errorMessage,
  duration = 2000,
}: UseFormToasterArgs<
  OnSubmitSuccessDataType,
  OnSubmitErrorDataType
>): UseFormToasterReturn<OnSubmitSuccessDataType, OnSubmitErrorDataType> {
  const toast = useToast();

  return {
    onSubmitSuccess: (props) => {
      toast.addToast({
        csVariant: "success",
        children:
          typeof successMessage === "string"
            ? successMessage
            : props
              ? successMessage(props)
              : "OK",
        duration: duration,
      });
    },
    onSubmitError: (props) => {
      toast.addToast({
        csVariant: "danger",
        children: errorMessage
          ? typeof errorMessage === "string"
            ? errorMessage
            : props
              ? errorMessage(props)
              : "Unknown error occurred. The error has been logged"
          : "Unknown error occurred. The error has been logged",
        duration: 30000,
      });
    },
  };
}
