// import { test, expect } from "@chromatic-com/playwright";
import { test } from "@playwright/test";

import percySnapshot from "@percy/playwright";

test("community page", async ({ page }) => {
  await page.goto("http://localhost:3000/c/riskofrain2");
  // await expect(page).toHaveScreenshot({ fullPage: true });
  await percySnapshot(page, "Community");
});
