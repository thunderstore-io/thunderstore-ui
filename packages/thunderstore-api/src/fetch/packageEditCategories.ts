import { RequestConfig } from "../index";
import { apiFetch2 } from "../apiFetch";

export type PackageEditMetaArgs = {
  community: string;
  namespace: string;
  package: string;
  current_categories: string[];
};

export type PackageEditApiArgs = {
  new_categories: string[];
};

export function packageEditCategories(
  config: RequestConfig,
  data: PackageEditApiArgs,
  meta: PackageEditMetaArgs
) {
  const path = `/api/cyberstorm/listing/${meta.community}/${meta.namespace}/${meta.package}/edit/categories/`;

  return apiFetch2({
    config,
    path,
    request: {
      method: "POST",
      body: JSON.stringify({
        ...data,
        current_categories: meta.current_categories,
      }),
    },
    useSession: true,
  });
}
