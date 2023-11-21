export interface RequestConfig {
  apiHost: string;

  // TODO: This should not be explicitly bound to a session ID but rather just
  //       accept any authorization header. Noting as currently out of scope.
  sessionId?: string;
}

export * from "./fetch/community";
export * from "./fetch/communityFilters";
export * from "./fetch/communityList";
export * from "./fetch/communityPackageListings";
export * from "./fetch/currentUser";
export * from "./fetch/namespacePackageListings";
export * from "./fetch/packageDependantsListings";
export * from "./fetch/teamDetails";
export * from "./fetch/teamMembers";
export * from "./fetch/teamServiceAccounts";
export * from "./fetch/teamCreate";
export * from "./errors";
