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
export * from "./post/team";
export * from "./post/teamMember";
export * from "./post/teamDetailsEdit";
export * from "./post/teamAddServiceAccount";
export * from "./post/teamServiceAccountRemove";
export * from "./post/userDelete";
export * from "./post/teamEditMember";
export * from "./post/package";
export * from "./post/packageListing";
export * from "./post/teamRemoveMember";
export * from "./post/userLinkedAccountDisconnect";
export * from "./post/frontend";
export * from "./post/submission";
export * from "./get/packageSubmission";
export * from "./post/usermedia";
// export * from "./post/teamServiceAccountRemove";
// export * from "./post/teamAddServiceAccount";
// export * from "./post/teamDetailsEdit";
// export * from "./post/teamEditMember";
// export * from "./post/teamRemoveMember";
// export * from "./post/userLinkedAccountDisconnect";
export * from "./delete/team";
export * from "./errors";
