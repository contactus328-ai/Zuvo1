import { test, expect } from "@playwright/test";
test("loads home and navigates to sign-in", async ({ page }) => {
  await page.goto("/");
  const health = await fetch(new URL("/api/health", page.url()).toString()).then(r => r.json());
  expect(health.ok).toBe(true);
  await expect(page).toHaveTitle(/Zuvo/i);
  await page.getByRole("link", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/signin/i);
});
