import { test, expect } from '@playwright/test'

test.describe('Admin — US3', () => {
  test('wrong passphrase shows error', async ({ page }) => {
    await page.goto('/admin')
    await page.fill('[data-testid="admin-passphrase"]', 'wrong-passphrase')
    await page.click('[data-testid="admin-submit"]')
    await expect(page.locator('[data-testid="admin-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="rsvp-table"]')).not.toBeVisible()
  })

  test('correct passphrase shows RSVP table', async ({ page }) => {
    await page.goto('/admin')
    await page.fill('[data-testid="admin-passphrase"]', process.env.ADMIN_PASSPHRASE ?? '')
    await page.click('[data-testid="admin-submit"]')
    await expect(page.locator('[data-testid="rsvp-table"]')).toBeVisible()
  })

  test('passphrase form is shown when not authenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('[data-testid="admin-passphrase"]')).toBeVisible()
  })
})
