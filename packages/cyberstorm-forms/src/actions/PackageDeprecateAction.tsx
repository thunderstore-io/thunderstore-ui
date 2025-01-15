import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import {
  ApiAction,
  PackageDeprecateActionSchema,
} from "@thunderstore/ts-api-react-actions";
import {
  packageDeprecate,
  RequestConfig,
} from "@thunderstore/thunderstore-api";

export function PackageDeprecateAction(props: {
  packageName: string;
  namespace: string;
  isDeprecated: boolean;
  dataUpdateTrigger: () => Promise<void>;
  config: RequestConfig;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `${
      props.isDeprecated ? "Undeprecated" : "Deprecated"
    } package ${props.packageName}`,
  });

  function onActionSuccess() {
    props.dataUpdateTrigger();
    onSubmitSuccess();
  }

  function onActionError() {
    onSubmitError();
  }

  const onSubmit = ApiAction({
    schema: PackageDeprecateActionSchema,
    meta: { packageName: props.packageName, namespace: props.namespace },
    endpoint: packageDeprecate,
    onSubmitSuccess: onActionSuccess,
    onSubmitError: onActionError,
    config: props.config,
  });

  return function () {
    onSubmit({ is_deprecated: !props.isDeprecated });
  };
}

PackageDeprecateAction.displayName = "PackageDeprecateAction";
