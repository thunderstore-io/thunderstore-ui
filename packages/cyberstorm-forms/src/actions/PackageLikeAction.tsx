import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import {
  ApiAction,
  packageLikeActionSchema,
} from "@thunderstore/ts-api-react-actions";
import { packageLike, RequestConfig } from "@thunderstore/thunderstore-api";

export function PackageLikeAction(props: {
  isLoggedIn: boolean;
  packageName: string;
  namespace: string;
  isLiked: boolean;
  dataUpdateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `${props.isLiked ? "Unliked" : "Liked"} package ${
      props.packageName
    }`,
    errorMessage: props.isLoggedIn
      ? "Unknown error occurred. The error has been logged"
      : "You must be logged in to like a package!",
  });

  function onActionSuccess() {
    props.dataUpdateTrigger();
    onSubmitSuccess();
  }

  function onActionError() {
    onSubmitError();
  }
  const onSubmit = ApiAction({
    schema: packageLikeActionSchema,
    meta: { namespace_id: props.namespace, package_name: props.packageName },
    endpoint: packageLike,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
    config: props.config,
  });

  return function () {
    onSubmit({ target_state: props.isLiked ? "unrated" : "rated" });
  };
}

PackageLikeAction.displayName = "PackageLikeAction";
