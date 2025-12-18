// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});

test("get started link btn", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await page.getByRole("link", { name: "Get Started" }).click();

  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});

test("get link home", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/GSB Frais/);
});

test("Connexion", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="login"]', "andre");
  await page.fill('input[name="password"]', "secret");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("http://localhost:3000/dashboard");

  await expect(page.getByText("Login with valid credentials")).toBeVisible();
});

test("Échec de la connexion", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="login"]', ".");
  await page.fill('input[name="password"]', ".");

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("Échec de la connexion");
    await dialog.accept();
  });

  await page.click('button[type="submit"]');

  

  await expect(page).toHaveURL("http://localhost:3000/login");
});

test("Stay in the dashboard", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="login"]', "andre");
  await page.fill('input[name="password"]', "secret");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("http://localhost:3000/dashboard");

  await page.reload();

  await expect(page).toHaveURL("http://localhost:3000/dashboard");

  await expect(page.getByText("Bienvenue sur Dashboard")).toBeVisible();
});

test('Déconnexion', async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.fill('input[name="login"]', "andre");
  await page.fill('input[name="password"]', "secret");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("http://localhost:3000/dashboard");

  await page.getByRole('button', { name: /déconnexion/i }).click();
  await expect(page).toHaveURL('http://localhost:3000/login');

});
