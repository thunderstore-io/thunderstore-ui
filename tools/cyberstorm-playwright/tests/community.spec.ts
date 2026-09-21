// import { test, expect } from "@chromatic-com/playwright";
import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("community page", async ({ page }) => {
  // Seeded by create_test_data (test-community-1/2/3). /c/riskofrain2 exists
  // from Django migrations but has no package listings in the test backend.
  await page.goto("http://localhost:3000/c/test-community-1");
  // await expect(page).toHaveScreenshot({ fullPage: true });
  await percySnapshot(page, "Community");
});
