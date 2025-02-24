import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import {
  ApiAction,
  packageLikeActionReturnSchema,
  packageLikeActionSchema,
} from "@thunderstore/ts-api-react-actions";
import {
  ApiError,
  packageLike,
  RequestConfig,
} from "@thunderstore/thunderstore-api";

export function PackageLikeAction(props: {
  isLoggedIn: boolean;
  dataUpdateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
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

  function onActionSuccess(result: typeof packageLikeActionReturnSchema._type) {
    props.dataUpdateTrigger();
    onSubmitSuccess(result);
  }

  function onActionError(e: Error | ApiError | unknown) {
    onSubmitError({ isLoggedIn: props.isLoggedIn, e: e });
  }
  const onSubmit = ApiAction({
    schema: packageLikeActionSchema,
    returnSchema: packageLikeActionReturnSchema,
    endpoint: packageLike,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
    config: props.config,
  });

  return function (
    isLiked: boolean,
    namespace: string,
    name: string,
    useSession: boolean
  ) {
    onSubmit(
      { target_state: isLiked ? "unrated" : "rated" },
      { namespace_id: namespace, package_name: name, useSession: useSession }
    );
  };
}

PackageLikeAction.displayName = "PackageLikeAction";
