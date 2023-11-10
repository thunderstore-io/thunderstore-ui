import { DapperTs } from "../index";

const communityId = "riskofrain2";
const namespaceId = "TestTeam";
let dapper: DapperTs;

beforeAll(() => {
  dapper = new DapperTs({ apiHost: "https://thunderstore.dev" });
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

it("executes getPackage without errors", async () => {
  await expect(dapper.getPackage()).resolves.not.toThrowError();
});

it("executes getPackageDependencies without errors", async () => {
  await expect(dapper.getPackageDependencies()).resolves.not.toThrowError();
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
