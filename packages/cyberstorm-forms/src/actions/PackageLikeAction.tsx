"use client";

import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import {
  ApiAction,
  packageLikeActionSchema,
} from "@thunderstore/ts-api-react-actions";
import { packageLike } from "@thunderstore/thunderstore-api";

export function PackageLikeAction(props: {
  isLoggedIn: boolean;
  packageName: string;
  uuid4: string;
  isLiked: boolean;
  currentUserUpdateTrigger: () => Promise<void>;
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
    props.currentUserUpdateTrigger();
    onSubmitSuccess();
  }

  function onActionError() {
    onSubmitError();
  }

  const onSubmit = ApiAction({
    schema: packageLikeActionSchema,
    meta: { uuid4: props.uuid4 },
    endpoint: packageLike,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
  });

  return function () {
    onSubmit({ target_state: props.isLiked ? "unrated" : "rated" });
  };
}

PackageLikeAction.displayName = "PackageLikeAction";
