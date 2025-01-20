import { DapperTs } from "../index";

const communityId = "test";
const namespaceId = "Testruction";
const packageName = "Testitute";
let dapper: DapperTs;

beforeAll(() => {
  dapper = new DapperTs(() => {
    return { apiHost: "https://thunderstore.dev" };
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
