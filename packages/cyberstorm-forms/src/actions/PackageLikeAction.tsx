import {
  ApiError,
  type RequestConfig,
  packageRate,
} from "@thunderstore/thunderstore-api";
import { ApiAction } from "@thunderstore/ts-api-react-actions";

import { useFormToaster } from "../useFormToaster";

export function PackageLikeAction(props: {
  isLoggedIn: boolean;
  dataUpdateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}): (
  isLiked: boolean,
  namespace: string,
  name: string,
  useSession: boolean
) => void {
  const { onSubmitSuccess, onSubmitError } = useFormToaster<
    { state: "rated" | "unrated" },
    { isLoggedIn: boolean; e: Error | ApiError | unknown }
  >({
    successMessage: (successProps) =>
      `${
        successProps.state === "rated" ? "Liked" : "Removed like from"
      } package`,
    errorMessage: (errorProps) =>
      errorProps.isLoggedIn
        ? `Error: ${errorProps.e}`
        : "You must be logged in to like a package!",
  });

  function onActionSuccess(result: Awaited<ReturnType<typeof packageRate>>) {
    props.dataUpdateTrigger();
    onSubmitSuccess(result);
  }

  function onActionError(e: Error | ApiError | unknown) {
    onSubmitError({ isLoggedIn: props.isLoggedIn, e: e });
  }
  const onSubmit = ApiAction({
    endpoint: packageRate,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
  });

  return function (
    isLiked: boolean,
    namespace: string,
    name: string,
    useSession: boolean
  ) {
    onSubmit({
      params: { namespace, package: name },
      data: { target_state: isLiked ? "unrated" : "rated" },
      queryParams: {},
      config: props.config,
      useSession,
    });
  };
}

PackageLikeAction.displayName = "PackageLikeAction";
