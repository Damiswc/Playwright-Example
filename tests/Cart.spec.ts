import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()

    await page.waitForURL('https://www.saucedemo.com/inventory.html')
})

test('Continue Shopping', async ({ page }) => {
    await page.locator('.shopping_cart_link').click()
    await page.getByText('Continue Shopping').click()
    await page.waitForURL('https://www.saucedemo.com/inventory.html')
})

test('Remove an item', async ({ page }) => {

    let item1Title = await page.locator('.inventory_item_name').first().textContent()
    let item1Price = await page.locator('.inventory_item_price').first().textContent()

    let item2Title = await page.locator('.inventory_item_name').last().textContent()
    let item2Price = await page.locator('.inventory_item_price').last().textContent()

    await page.getByText('Add to cart').first().click()
    await page.getByText('Add to cart').last().click()

    await page.locator('.shopping_cart_link').click()

    await expect(page.locator('.cart_item').first()).toContainText(item1Price + '')
    await expect(page.locator('.cart_item').first()).toContainText(item1Title + '')

    await expect(page.locator('.cart_item').last()).toContainText(item2Price + '')
    await expect(page.locator('.cart_item').last()).toContainText(item2Title + '')

    await page.getByText('Remove').first().click()

    await expect(await page.locator('.cart_item').count()).toEqual(1)

    //Check if backward page removed item 

    await page.goBack()

    await expect(await page.getByText('Remove').count()).toEqual(1)

    await expect(await page.locator('.inventory_item').first()).toContainText('Add to cart')





})

test('Checkout OK', async ({ page }) => {
    await page.getByText('Add to cart').first().click()
    await page.locator('.shopping_cart_link').click()
    await page.getByText('Checkout').click()
    await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html')

})

test('Checkout without items', async ({ page }) => {
    await page.locator('.shopping_cart_link').click()

    //Can't continue if user doesn't add an item to cart
    await expect(page.getByText('Checkout')).toBeDisabled()


})