import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()

    await page.waitForURL('https://www.saucedemo.com/inventory.html')
})


test('Twitter', async ({ page, context }) => {
    let pagePromise = context.waitForEvent('page');
    await page.locator('a').filter({ hasText: 'Twitter' }).click()

    let twitterPage = await pagePromise;

    await twitterPage.waitForLoadState()
    expect(twitterPage.url()).toContain('twitter.com/saucelabs')
})

test('Facebook', async ({ page, context }) => {
    let pagePromise = context.waitForEvent('page');
    await page.locator('a').filter({ hasText: 'Facebook' }).click()

    let twitterPage = await pagePromise;

    await twitterPage.waitForLoadState()
    expect(twitterPage.url()).toContain('facebook.com/saucelabs')
})

test('Linkedin', async ({ page, context }) => {
    let pagePromise = context.waitForEvent('page');
    await page.locator('a').filter({ hasText: 'LinkedIn' }).click()

    let twitterPage = await pagePromise;

    await twitterPage.waitForLoadState()
    expect(twitterPage.url()).toContain('linkedin')
})