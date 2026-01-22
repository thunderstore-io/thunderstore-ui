import { fetchRatedPackages, isApiError } from "@thunderstore/thunderstore-api";

import type { DapperTsInterface } from "../index";

export async function getRatedPackages(this: DapperTsInterface) {
  try {
    const data = await fetchRatedPackages({
      config: this.config,
      params: {},
      data: {},
      queryParams: {},
    });

    return data;
  } catch (error) {
    if (isApiError(error) && error.response.status === 401) {
      this.removeSessionHook?.();
      return { rated_packages: [] };
    }
    throw error;
  }
}
