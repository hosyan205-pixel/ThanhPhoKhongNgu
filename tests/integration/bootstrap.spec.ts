import { expect, test } from '@playwright/test';
import { healthResponseSchema } from '@tpkn/validation';

test('web bootstrap renders without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173');
  await expect(page.getByRole('heading', { name: 'Thành Phố Không Ngủ' })).toBeVisible();
  await expect(page.getByText('Đêm nay vẫn có người thức cùng bạn.')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-environment', 'development');
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('admin bootstrap renders without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:5174');
  await expect(page.getByRole('heading', { name: 'Thành Phố Không Ngủ — Admin' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('gateway health works in the local Worker runtime', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:8787/health');
  expect(response.status()).toBe(200);
  expect(healthResponseSchema.parse(await response.json())).toEqual({
    status: 'ok',
    service: 'gateway',
    environment: 'development',
  });
});
