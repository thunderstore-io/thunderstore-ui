import { it, expect, beforeAll, test } from "vitest";
import { DapperTs } from "../index";

const communityId = "test-community-1";
const namespaceId = "Test_Team_0";
const packageName = "Test_Package_0";
const packageVersion = "1.0.0";
let dapper: DapperTs;

beforeAll(() => {
  dapper = new DapperTs(() => {
    return { apiHost: "http://127.0.0.1:8000" };
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

// TODO: Disabled temporarily until we decide on a testing strategy/policy regarding e2e tests
test.skip("executes getPackageVersionDependencies without errors", async () => {
  await expect(
    dapper.getPackageVersionDependencies(
      namespaceId,
      packageName,
      packageVersion
    )
  ).resolves.not.toThrowError();
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

// TODO: Disabled temporarily until we decide on a testing strategy/policy regarding e2e tests
test.skip("executes getPackageSource without errors", async () => {
  await expect(
    dapper.getPackageSource(namespaceId, packageName)
  ).resolves.not.toThrowError();
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
