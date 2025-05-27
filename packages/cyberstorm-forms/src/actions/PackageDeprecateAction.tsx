import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import { ApiAction } from "@thunderstore/ts-api-react-actions";
import {
  ApiError,
  packageDeprecate,
  RequestConfig,
} from "@thunderstore/thunderstore-api";

export function PackageDeprecateAction(props: {
  packageName: string;
  namespace: string;
  isDeprecated: boolean;
  dataUpdateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster<
    { isDeprecated: boolean; packageName: string; namespace: string },
    { isLoggedIn: boolean; e: Error | ApiError | unknown }
  >({
    successMessage: (successProps) =>
      `${successProps.isDeprecated ? "Undeprecated" : "Deprecated"} package ${
        successProps.packageName
      }`,
    errorMessage: (errorProps) =>
      errorProps.isLoggedIn
        ? `Error: ${errorProps.e}`
        : "You must be logged in to deprecate a package!",
  });

  function onActionSuccess() {
    props.dataUpdateTrigger();
    onSubmitSuccess();
  }

  function onActionError() {
    onSubmitError();
  }

  const onSubmit = ApiAction({
    endpoint: packageDeprecate,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
  });

  return function () {
    onSubmit({
      params: { package: props.packageName, namespace: props.namespace },
      data: { deprecate: !props.isDeprecated },
      queryParams: {},
      config: props.config,
      useSession: true,
    });
  };
}

PackageDeprecateAction.displayName = "PackageDeprecateAction";
