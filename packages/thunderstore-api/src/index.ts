export interface RequestConfig {
  apiHost?: string;

  // TODO: This should not be explicitly bound to a session ID but rather just
  //       accept any authorization header. Noting as currently out of scope.
  sessionId?: string;
}

export * from "./get/dynamicHTML";
export * from "./get/community";
export * from "./get/communityFilters";
export * from "./get/communityList";
export * from "./get/communityPackageListings";
export * from "./get/currentUser";
export * from "./get/ratedPackages";
export * from "./get/namespacePackageListings";
export * from "./get/packageChangelog";
export * from "./get/packageDependantsListings";
export * from "./get/packageListingDetails";
export * from "./get/packageReadme";
export * from "./get/packageVersions";
export * from "./get/teamDetails";
export * from "./get/teamMembers";
export * from "./get/teamServiceAccounts";
export * from "./post/teamCreate";
export * from "./post/teamAddMember";
export * from "./post/teamDetailsEdit";
export * from "./post/teamAddServiceAccount";
export * from "./post/teamServiceAccountRemove";
export * from "./post/userDelete";
export * from "./post/teamDisbandTeam";
export * from "./post/teamEditMember";
export * from "./post/packageLike";
export * from "./post/packageEditCategories";
export * from "./post/packageDeprecate";
export * from "./post/teamRemoveMember";
export * from "./post/userLinkedAccountDisconnect";
export * from "./post/toolsManifestValidate";
export * from "./post/toolsMarkdownPreview";
export * from "./post/packageSubmission";
export * from "./get/packageSubmission";
export * from "./post/usermediaInitiate";
export * from "./post/usermediaFinish";
export * from "./post/usermediaAbort";
export * from "./errors";
