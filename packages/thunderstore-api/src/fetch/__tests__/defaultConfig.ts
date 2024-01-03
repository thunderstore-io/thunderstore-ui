export const config = {
  apiHost: process.env.TEST_API_DOMAIN ?? "https://thunderstore.dev",
};

/**
 * Information used by the test cases. Values should match the contents
 * of the database used by TEST_API_DOMAIN.
 */
export const testData = {
  communityId: process.env.TEST_COMMUNITY ?? "test",
  namespaceId: process.env.TEST_NAMESPACE ?? "Testruction",
  packageName: process.env.TEST_PACKAGE ?? "Testitute",
};
