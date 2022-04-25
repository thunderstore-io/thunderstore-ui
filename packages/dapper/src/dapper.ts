import { z } from "zod";

import { DapperError } from "./errors";
import {
  getCommunityPackageListing,
  GetCommunityPackageListing,
} from "./methods/communityPackageList";
import { getFrontpage, GetFrontpage } from "./methods/frontpage";
import { QsArray, serializeQueryString } from "./queryString";

export interface DapperInterface {
  getCommunityPackageListing: GetCommunityPackageListing;
  getFrontpage: GetFrontpage;
}

export class Dapper implements DapperInterface {
  readonly apiDomain: string;
  readonly apiPath = "api/experimental/frontend";

  constructor(domain: string) {
    this.apiDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;
  }

  /**
   * Internal ease-of-use methods.
   */
  protected async fetch<T extends z.ZodTypeAny>(
    url: string,
    schema: T
  ): Promise<z.infer<T>> {
    let response;

    try {
      response = await fetch(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Data fetching error";
      throw new DapperError(msg, url, DapperError.FETCH_ERROR);
    }

    if (!response.ok) {
      throw new DapperError(response.statusText, url, response.status);
    }

    let values;

    try {
      values = await response.json();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Deserialization response";
      throw new DapperError(msg, url, DapperError.JSON_ERROR);
    }

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const msg = parsed.error.toString();
      throw new DapperError(msg, url, DapperError.VALIDATION_ERROR);
    }

    return parsed.data;
  }

  protected getUrl(path: string, queryString: string): string {
    const baseUrl = `${this.apiDomain}/${this.apiPath}/${path}`;
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  protected async queryAndProcess<Schema extends z.ZodTypeAny, ReturnType>(
    path: string,
    queryParams: QsArray,
    schema: Schema,
    transform: (cleanedData: z.infer<Schema>) => ReturnType
  ): Promise<ReturnType> {
    const queryString = serializeQueryString(queryParams);
    const url = this.getUrl(path, queryString);
    const cleanedData = await this.fetch<typeof schema>(url, schema);
    return transform(cleanedData);
  }

  /**
   * Methods implementing the DapperInterface.
   */
  getCommunityPackageListing = getCommunityPackageListing;
  getFrontpage = getFrontpage;
}
