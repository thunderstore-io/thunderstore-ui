// import { test, expect } from "@chromatic-com/playwright";
import { expect, test } from "@playwright/test";

const percySnapshot = require("@percy/playwright");

test("communities page", async ({ page }) => {
  await page.goto("http://localhost:3000/communities");
  // await expect(page).toHaveScreenshot({ fullPage: true });
  await percySnapshot(page, "Communities");
});
