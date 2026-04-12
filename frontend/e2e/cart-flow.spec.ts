import { test, expect } from '@playwright/test';

test('add product to cart and verify cart displays item', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(
    page.getByRole('link', { name: /wireless headphones/i })
  ).toBeVisible();

  await page.getByRole('link', { name: /wireless headphones/i }).first().click();

  await expect(
    page.getByRole('heading', { name: /wireless headphones/i })
  ).toBeVisible();

  const addButton = page.locator('button', { hasText: /add to cart/i }).first();
  await expect(addButton).toBeVisible();
  await expect(addButton).toBeEnabled();
  await addButton.click();

  const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
  await expect(cartButton).toBeVisible();
  await cartButton.click();

  await expect(page.getByText(/wireless headphones/i)).toBeVisible();
  await expect(page.getByText(/\$149\.99/)).toBeVisible();
});