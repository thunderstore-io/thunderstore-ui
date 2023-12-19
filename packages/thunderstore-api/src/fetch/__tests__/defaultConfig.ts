export const config = {
  apiHost: process.env.TEST_API_DOMAIN ?? "https://thunderstore.dev",
};

/**
 * Information used by the test cases. Values should match the contents
 * of the database used by TEST_API_DOMAIN.
 */
export const testData = {
  communityId: process.env.TEST_COMMUNITY ?? "riskofrain2",
  namespaceId: process.env.TEST_NAMESPACE ?? "TestTeam",
  packageName: process.env.TEST_PACKAGE ?? "PackageName",
};
