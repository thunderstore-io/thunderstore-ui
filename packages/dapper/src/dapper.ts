import { z } from "zod";
import { GetCommunities } from "./cyberstormMethods/communities";
import { GetCommunity } from "./cyberstormMethods/community";
import { GetPackage } from "./cyberstormMethods/package";
import { GetPackageListings } from "./cyberstormMethods/packageListings";
import { GetTeam } from "./cyberstormMethods/team";
import { GetUser } from "./cyberstormMethods/user";

import { DapperError } from "./errors";
import { QsArray, serializeQueryString } from "./queryString";
import { GetPackageDependencies } from "./cyberstormMethods/packageDependencies";
import { GetUserSettings } from "./cyberstormMethods/userSettings";
import { GetServiceAccount } from "./cyberstormMethods/serviceAccount";
import { GetTeamList } from "./cyberstormMethods/teamList";
import { GetServiceAccountList } from "./cyberstormMethods/serviceAccountList";

export interface DapperInterface {
  sessionId?: string;

  getPackageListings: GetPackageListings;
  getCommunities: GetCommunities;
  getCommunity: GetCommunity;
  getPackage: GetPackage;
  getPackageDependencies: GetPackageDependencies;
  getServiceAccount: GetServiceAccount;
  getServiceAccountList: GetServiceAccountList;
  getTeam: GetTeam;
  getTeamList: GetTeamList;
  getUser: GetUser;
  getUserSettings: GetUserSettings;
}

const NotImplemented = () => {
  throw new Error("Not implemented");
};

export class Dapper implements DapperInterface {
  readonly apiDomain: string;
  readonly sessionId?: string;

  constructor(domain: string, sessionId?: string) {
    this.apiDomain = domain.endsWith("/") ? domain.slice(0, -1) : domain;
    this.sessionId = sessionId;
  }

  /**
   * Internal ease-of-use methods.
   */
  protected async fetch<T extends z.ZodTypeAny>(
    url: string,
    schema: T
  ): Promise<z.infer<T>> {
    const settings: RequestInit = this.sessionId
      ? { headers: { authorization: `Session ${this.sessionId}` } }
      : {};

    let response;

    try {
      response = await fetch(url, settings);
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
    const baseUrl = `${this.apiDomain}/${path}`;
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

  getCommunities = NotImplemented;
  getCommunity = NotImplemented;
  getPackage = NotImplemented;
  getPackageDependencies = NotImplemented;
  getPackageListings = NotImplemented;
  getServiceAccount = NotImplemented;
  getServiceAccountList = NotImplemented;
  getTeam = NotImplemented;
  getTeamList = NotImplemented;
  getUser = NotImplemented;
  getUserSettings = NotImplemented;
}
