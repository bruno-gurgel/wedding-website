import { test, expect } from '@playwright/test'

test.describe('RSVP — US1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#confirmacao')
    await page.waitForSelector('#confirmacao')
  })

  test('guest submits attending=true and sees confirmation', async ({ page }) => {
    await page.fill('[data-testid="rsvp-name"]', 'Maria Silva')
    await page.click('[data-testid="rsvp-attending-yes"]')
    await page.click('[data-testid="rsvp-submit"]')
    await expect(page.locator('[data-testid="rsvp-confirmation"]')).toBeVisible()
  })

  test('guest submits attending=false and sees confirmation', async ({ page }) => {
    await page.fill('[data-testid="rsvp-name"]', 'João Ausente')
    await page.click('[data-testid="rsvp-attending-no"]')
    await page.click('[data-testid="rsvp-submit"]')
    await expect(page.locator('[data-testid="rsvp-confirmation"]')).toBeVisible()
  })

  test('form blocks submission without a name', async ({ page }) => {
    await page.click('[data-testid="rsvp-attending-yes"]')
    await page.click('[data-testid="rsvp-submit"]')
    await expect(page.locator('[data-testid="rsvp-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="rsvp-confirmation"]')).not.toBeVisible()
  })

  test('form blocks submission without attendance choice', async ({ page }) => {
    await page.fill('[data-testid="rsvp-name"]', 'Ana Costa')
    await page.click('[data-testid="rsvp-submit"]')
    await expect(page.locator('[data-testid="rsvp-error"]')).toBeVisible()
  })
})
