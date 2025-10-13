export const config = () => {
  return {
    apiHost: "http://127.0.0.1:8000",
  };
};

/**
 * Information used by the test cases. Values should match the contents
 * of the database used by TEST_API_DOMAIN.
 */
export const testData = {
  communityId: "test-community-1",
  namespaceId: "Test_Team_0",
  packageName: "Test_Package_0",
  versionNumber: "1.0.0",
};
