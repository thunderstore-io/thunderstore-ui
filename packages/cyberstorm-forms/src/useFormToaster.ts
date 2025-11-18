import { useToast } from "@thunderstore/cyberstorm";
import {
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";

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
      const resolvedMessage = resolveErrorMessage(props, errorMessage);

      toast.addToast({
        csVariant: "danger",
        children: resolvedMessage,
        duration: 30000,
      });
    },
  };
}

function resolveErrorMessage<OnSubmitErrorDataType>(
  props: OnSubmitErrorDataType | undefined,
  override?: string | ((props: OnSubmitErrorDataType) => string)
): string {
  if (override) {
    if (typeof override === "string") {
      return override;
    }
    if (props) {
      return override(props);
    }
  }

  if (props instanceof UserFacingError) {
    return formatUserFacingError(props, {
      fallback: "Unknown error occurred. The error has been logged",
    });
  }

  return "Unknown error occurred. The error has been logged";
}
