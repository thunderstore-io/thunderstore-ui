import percySnapshot from "@percy/playwright";
import { type APIRequestContext, test } from "@playwright/test";

const API = "http://127.0.0.1:8000";

async function firstTestCommunityPackagePath(
  request: APIRequestContext
): Promise<string> {
  const communitiesRes = await request.get(`${API}/api/cyberstorm/community/`, {
    params: { search: "Test Community" },
  });
  if (!communitiesRes.ok()) {
    throw new Error(`Community list failed: ${communitiesRes.status()}`);
  }
  const communities: { identifier: string }[] =
    (await communitiesRes.json()).results ?? [];
  const prefix = "test-community-";
  const community = communities
    .filter((c) => c.identifier.startsWith(prefix))
    .sort(
      (a, b) =>
        Number(a.identifier.slice(prefix.length)) -
        Number(b.identifier.slice(prefix.length))
    )[0];
  if (!community) {
    throw new Error("No test-community-* found in /api/cyberstorm/community/");
  }

  const listingsRes = await request.get(
    `${API}/api/cyberstorm/listing/${community.identifier}/`
  );
  if (!listingsRes.ok()) {
    throw new Error(`Listing list failed: ${listingsRes.status()}`);
  }
  const pkg: { namespace: string; name: string } | undefined = (
    await listingsRes.json()
  ).results?.[0];
  if (!pkg) {
    throw new Error(`No packages listed for ${community.identifier}`);
  }
  return `/c/${community.identifier}/p/${pkg.namespace}/${pkg.name}/`;
}

test("package listing page", async ({ page, request }) => {
  const path = await firstTestCommunityPackagePath(request);
  await page.goto(`http://localhost:3000${path}`);
  await percySnapshot(page, "Package listing");
});
