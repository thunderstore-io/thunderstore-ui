import percySnapshot from "@percy/playwright";
import { test } from "@playwright/test";

test("home page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await percySnapshot(page, "Home");
});
