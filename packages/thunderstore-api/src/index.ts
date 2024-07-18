export interface RequestConfig {
  apiHost?: string;

  // TODO: This should not be explicitly bound to a session ID but rather just
  //       accept any authorization header. Noting as currently out of scope.
  sessionId?: string;
  csrfToken?: string;
}

export * from "./fetch/dynamicHTML";
export * from "./fetch/community";
export * from "./fetch/communityFilters";
export * from "./fetch/communityList";
export * from "./fetch/communityPackageListings";
export * from "./fetch/currentUser";
export * from "./fetch/namespacePackageListings";
export * from "./fetch/packageChangelog";
export * from "./fetch/packageDependantsListings";
export * from "./fetch/packageListingDetails";
export * from "./fetch/packageReadme";
export * from "./fetch/packageVersions";
export * from "./fetch/teamDetails";
export * from "./fetch/teamMembers";
export * from "./fetch/teamServiceAccounts";
export * from "./fetch/teamCreate";
export * from "./fetch/teamAddMember";
export * from "./fetch/teamDetailsEdit";
export * from "./fetch/teamAddServiceAccount";
export * from "./fetch/teamServiceAccountRemove";
export * from "./fetch/userDelete";
export * from "./fetch/teamDisbandTeam";
export * from "./fetch/teamEditMember";
export * from "./fetch/packageLike";
export * from "./fetch/packageEditCategories";
export * from "./fetch/packageDeprecate";
export * from "./fetch/teamRemoveMember";
export * from "./fetch/userLinkedAccountDisconnect";
export * from "./errors";
