import { beforeAll, expect, it, test } from "vitest";

import { DapperTs } from "../index";

const communityId = "test-community-1";
const namespaceId = "Test_Team_0";
const packageName = "Test_Package_0";
const packageVersion = "1.0.0";
let dapper: DapperTs;

beforeAll(() => {
  dapper = new DapperTs(() => {
    return {
      apiHost:
        import.meta.env.VITE_THUNDERSTORE_TEST_API_HOST ??
        "http://127.0.0.1:8000",
    };
  });
});

it("executes getCommunities without errors", async () => {
  await expect(dapper.getCommunities()).resolves.not.toThrowError();
});

it("executes getCommunity without errors", async () => {
  await expect(dapper.getCommunity(communityId)).resolves.not.toThrowError();
});

it("executes getCommunityFilters without errors", async () => {
  await expect(
    dapper.getCommunityFilters(communityId)
  ).resolves.not.toThrowError();
});

// TODO: this should be tested/mocked with sessionId too.
it("executes getCurrentUser without errors", async () => {
  await expect(dapper.getCurrentUser()).resolves.not.toThrowError();
});

it("executes getPackageChangelog without errors", async () => {
  await expect(
    dapper.getPackageChangelog(namespaceId, packageName)
  ).resolves.not.toThrowError();
});

test("executes getPackageVersionDependencies without errors", async () => {
  const response = await dapper.getPackageVersionDependencies(
    namespaceId,
    packageName,
    packageVersion
  );

  expect(response.count).toBeTypeOf("number");
  expect(Array.isArray(response.results)).toBe(true);
});

it("executes getPackageListingDetails without errors", async () => {
  await expect(
    dapper.getPackageListingDetails(communityId, namespaceId, packageName)
  ).resolves.not.toThrowError();
});

it("executes getPackageListings for community without errors", async () => {
  await expect(
    dapper.getPackageListings({ kind: "community", communityId })
  ).resolves.not.toThrowError();
});

it("executes getPackageListings for namespace without errors", async () => {
  await expect(
    dapper.getPackageListings({
      kind: "namespace",
      communityId,
      namespaceId,
    })
  ).resolves.not.toThrowError();
});

it("executes getPackageReadme without errors", async () => {
  await expect(
    dapper.getPackageReadme(namespaceId, packageName)
  ).resolves.not.toThrowError();
});

test("executes getPackageSource when enabled (or 404 when disabled)", async () => {
  try {
    const response = await dapper.getPackageSource(namespaceId, packageName);

    // If the endpoint exists in the backend image, validate a minimal shape.
    expect(response).toBeTruthy();
    expect(response).toHaveProperty("namespace");
    expect(response).toHaveProperty("package_name");
    expect(response).toHaveProperty("version_number");
    expect(response).toHaveProperty("is_visible");
    expect(response).toHaveProperty("decompilations");
    expect(Array.isArray(response.decompilations)).toBe(true);
  } catch (err) {
    // The test backend image used for containerized tests may not include the
    // plugin that registers this endpoint. Treat a 404 as "endpoint disabled".
    if (err instanceof Error && err.message.includes("404")) {
      return;
    }

    throw err;
  }
});

it("executes getPackageVersions without errors", async () => {
  await expect(
    dapper.getPackageVersions(namespaceId, packageName)
  ).resolves.not.toThrowError();
});

it("executes getTeamDetails without errors", async () => {
  await expect(dapper.getTeamDetails(namespaceId)).resolves.not.toThrowError();
});

// TODO: this should be tested/mocked with sessionId too.
it("executes getTeamMembers with 401 error", async () => {
  await expect(dapper.getTeamMembers(namespaceId)).rejects.toThrowError(
    "401: Unauthorized"
  );
});

// TODO: this should be tested/mocked with sessionId too.
it("executes getTeamServiceAccounts with 401 error", async () => {
  await expect(dapper.getTeamServiceAccounts(namespaceId)).rejects.toThrowError(
    "401: Unauthorized"
  );
});
