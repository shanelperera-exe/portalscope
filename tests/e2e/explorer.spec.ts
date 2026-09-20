import { expect, test } from '@playwright/test';

test('navigates to characters and shows results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Characters', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Characters' })).toBeVisible();
  await expect(page.locator('.card').first()).toBeVisible({ timeout: 20_000 });
});

test('searches for Rick Sanchez', async ({ page }) => {
  await page.goto('/characters');
  await page.getByLabel('Search').fill('Rick Sanchez');
  await expect(page.getByRole('link', { name: /Rick Sanchez/ }).first()).toBeVisible({
    timeout: 20_000,
  });
});

test('opens Rick Sanchez details', async ({ page }) => {
  await page.goto('/characters?name=Rick%20Sanchez');
  await page.getByRole('link', { name: /Rick Sanchez/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Rick Sanchez' })).toBeVisible();
  await expect(page.getByText(/Episode count:/)).toBeVisible();
});

test('adds and removes Rick from favorites', async ({ page }) => {
  await page.goto('/characters?name=Rick%20Sanchez');
  await page.getByRole('link', { name: /Rick Sanchez/ }).first().click();
  const addButton = page.getByRole('button', { name: 'Add to favorites' });
  if (await addButton.isVisible()) {
    await addButton.click();
  }
  await page.getByRole('link', { name: 'Favorites' }).click();
  await expect(page.getByRole('link', { name: /Rick Sanchez/ }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Remove favorite' }).first().click();
  await expect(page.getByText('Your portal collection is empty.')).toBeVisible();
});
