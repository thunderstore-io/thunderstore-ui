import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type packageDeprecateMetaArgs = {
  packageName: string;
  namespace: string;
};

export type packageDeprecateApiArgs = {
  is_deprecated: boolean;
};

export function packageDeprecate(
  config: () => RequestConfig,
  data: packageDeprecateApiArgs,
  meta: packageDeprecateMetaArgs
) {
  const path = `/api/cyberstorm/package/${meta.namespace}/${meta.packageName}/deprecate/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data),
    },
    useSession: true,
  });
}
