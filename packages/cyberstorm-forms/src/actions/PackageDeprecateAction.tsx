import { useFormToaster } from "@thunderstore/cyberstorm-forms";
import {
  ApiAction,
  PackageDeprecateActionSchema,
} from "@thunderstore/ts-api-react-actions";
import { packageDeprecate } from "@thunderstore/thunderstore-api";

export function PackageDeprecateAction(props: {
  packageName: string;
  namespace: string;
  isDeprecated: boolean;
  packageDataUpdateTrigger: () => Promise<void>;
}) {
  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: `${
      props.isDeprecated ? "Undeprecated" : "Deprecated"
    } package ${props.packageName}`,
  });

  function onActionSuccess() {
    props.packageDataUpdateTrigger();
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
  });

  return function () {
    onSubmit({ is_deprecated: !props.isDeprecated });
  };
}

PackageDeprecateAction.displayName = "PackageDeprecateAction";
