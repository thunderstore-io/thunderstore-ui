export interface RequestConfig {
  apiHost?: string;

  // TODO: This should not be explicitly bound to a session ID but rather just
  //       accept any authorization header. Noting as currently out of scope.
  sessionId?: string;
}

export interface ApiEndpointProps<Params, QueryParams, Data> {
  config: () => RequestConfig;
  useSession?: boolean;
  data: Data;
  params: Params;
  queryParams: QueryParams;
}

export const BASE_LISTING_PATH = "api/cyberstorm/listing/";

export * from "./delete/packageWiki";
export * from "./delete/teamDisband";
export * from "./delete/teamRemoveMember";
export * from "./delete/teamServiceAccountRemove";
export * from "./delete/userDelete";
export * from "./delete/userLinkedAccountDisconnect";
export * from "./get/community";
export * from "./get/communityFilters";
export * from "./get/communityList";
export * from "./get/communityPackageListings";
export * from "./get/currentUser";
export * from "./get/dynamicHTML";
export * from "./get/namespacePackageListings";
export * from "./get/package";
export * from "./get/packageChangelog";
export * from "./get/packageDependantsListings";
export * from "./get/packageListingDetails";
export * from "./get/packageReadme";
export * from "./get/packageSubmission";
export * from "./get/packageVersionDependencies";
export * from "./get/packageVersions";
export * from "./get/packageVersionDetails";
export * from "./get/packageWiki";
export * from "./get/ratedPackages";
export * from "./get/packageSource";
export * from "./get/teamDetails";
export * from "./get/teamMembers";
export * from "./get/teamServiceAccounts";
export * from "./patch/teamDetailsEdit";
export * from "./patch/teamEditMember";
export * from "./post/frontend";
export * from "./post/package";
export * from "./post/packageListing";
export * from "./post/packageWiki";
export * from "./post/submission";
export * from "./post/team";
export * from "./post/teamAddServiceAccount";
export * from "./post/teamMember";
export * from "./post/usermedia";
export * from "./errors";
export * from "./schemas/requestSchemas";
export * from "./schemas/responseSchemas";
export * from "./schemas/objectSchemas";
export * from "./schemas/queryParamSchemas";
