import { test, expect } from "@playwright/test";

test("health endpoint returns ok", async ({ request, baseURL }) => {
  // baseURL is http://localhost:4173 from playwright.config.ts
  const resp = await request.get(new URL("/api/health", baseURL!).toString());
  expect(resp.ok()).toBeTruthy();
  const json = await resp.json();
  expect(json.ok).toBe(true);
  expect(typeof json.ts).toBe("string");
});
