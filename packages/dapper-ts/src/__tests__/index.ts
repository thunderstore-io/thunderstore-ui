import { DapperTs } from "../index";

let dapper: DapperTs;

beforeAll(() => {
  dapper = new DapperTs({ apiHost: "https://thunderstore.dev" });
});

it("executes getCommunities without errors", async () => {
  await expect(dapper.getCommunities()).resolves.not.toThrowError();
});

it("executes getCommunity without errors", async () => {
  await expect(dapper.getCommunity()).resolves.not.toThrowError();
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

it("executes getPackageListings without errors", async () => {
  await expect(dapper.getPackageListings()).resolves.not.toThrowError();
});

it("executes getServiceAccount without errors", async () => {
  await expect(dapper.getServiceAccount()).resolves.not.toThrowError();
});

it("executes getServiceAccountList without errors", async () => {
  await expect(dapper.getServiceAccountList()).resolves.not.toThrowError();
});

it("executes getTeam without errors", async () => {
  await expect(dapper.getTeam()).resolves.not.toThrowError();
});

it("executes getUser without errors", async () => {
  await expect(dapper.getUser()).resolves.not.toThrowError();
});
