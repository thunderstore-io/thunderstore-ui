import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export interface toolsManifestValidateApiArgs {
  namespace: string;
  manifest_data: string;
}

export function toolsManifestValidate(
  config: () => RequestConfig,
  data: toolsManifestValidateApiArgs
) {
  const path = `/api/experimental/submission/validate/manifest-v1/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify(data),
    },
    useSession: true,
  });
}
