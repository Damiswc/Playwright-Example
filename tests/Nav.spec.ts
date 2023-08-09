import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()

    await page.waitForURL('https://www.saucedemo.com/inventory.html')
})

test.describe('Burger Menu', () => {
    test('All items', async ({ page }) => {
        await page.locator('.shopping_cart_container').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true')
        await page.locator('.bm-burger-button').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false')
        await expect(page.locator('.bm-menu')).toBeVisible()


        await page.getByText('All Items').click()
        await page.waitForURL('https://www.saucedemo.com/inventory.html')
    })

    test('About', async ({ page }) => {

        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true')
        await page.locator('.bm-burger-button').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false')
        await expect(page.locator('.bm-menu')).toBeVisible()


        await page.getByText('About').click()
        await page.waitForURL('https://saucelabs.com/')
    })

    test('Logout', async ({ page }) => {

        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true')
        await page.locator('.bm-burger-button').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false')
        await expect(page.locator('.bm-menu')).toBeVisible()


        await page.getByText('Logout').click()
        await page.waitForURL('https://www.saucedemo.com/')
    })

    test('Close Burger Menu', async ({ page }) => {
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true')
        await page.locator('.bm-burger-button').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'false')
        await expect(page.locator('.bm-menu')).toBeVisible()

        await page.locator('.bm-cross-button').click()
        await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true')
        await expect(page.locator('.bm-menu')).not.toBeVisible()
    })

})

test('Cart', async ({ page }) => {
    await page.locator('.shopping_cart_link').click()
    await page.waitForURL('https://www.saucedemo.com/cart.html')
})