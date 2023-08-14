import { test, expect } from '@playwright/test';

let item1Title, item1Price, item2Title, item2Price
test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()

    await page.waitForURL('https://www.saucedemo.com/inventory.html')

    item1Title = await page.locator('.inventory_item_name').first().textContent()
    item1Price = await page.locator('.inventory_item_price').first().textContent()

    item2Title = await page.locator('.inventory_item_name').last().textContent()
    item2Price = await page.locator('.inventory_item_price').last().textContent()

    await page.getByText('Add to cart').first().click()
    await page.getByText('Add to cart').last().click()

    await page.locator('.shopping_cart_link').click()
    await page.getByText('Checkout').click()
    await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html')
})

test.describe('Checkout step one', () => {
    test.describe('Continue', () => {
        test('Continue missing first name', async ({ page }) => {

            await page.locator('[data-test="lastName"]').type('asd123')
            await page.locator('[data-test="postalCode"]').type('1870')
            await page.locator('[id="continue"]').click()

            await expect(page.getByText('Error: First Name is required')).toBeVisible()
            await expect(page.locator('[data-test="firstName"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="firstName"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

        })

        test('Continue missing last name', async ({ page }) => {
            await page.locator('[data-test="firstName"]').type('asd123')
            await page.locator('[data-test="postalCode"]').type('1880')
            await page.locator('[id="continue"]').click()

            await expect(page.getByText('Error: Last Name is required')).toBeVisible()
            await expect(page.locator('[data-test="lastName"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="lastName"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

        })

        test('Continue missing zip code', async ({ page }) => {
            await page.locator('[data-test="firstName"]').type('asd123')
            await page.locator('[data-test="lastName"]').type('asd123')
            await page.locator('[id="continue"]').click()

            await expect(page.getByText('Error: Postal Code is required')).toBeVisible()
            await expect(page.locator('[data-test="postalCode"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="postalCode"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

        })

        test('Continue missing every input', async ({ page }) => {

            await page.locator('[id="continue"]').click()
            await expect(page.locator('[data-test="firstName"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="firstName"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()
            await expect(page.locator('[data-test="postalCode"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="postalCode"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()
            await expect(page.locator('[data-test="lastName"]')).toHaveClass('input_error form_input error')
            await expect(page.locator('[data-test="lastName"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

        })

        test('Continue OK', async ({ page }) => {
            await page.locator('[data-test="firstName"]').type('asd123')
            await page.locator('[data-test="lastName"]').type('asd123')
            await page.locator('[data-test="postalCode"]').type('1880')
            await page.locator('[id="continue"]').click()

        })

    })

    test('Cancel', async ({ page }) => {
        await page.getByText('Cancel').click()
        await page.waitForURL('https://www.saucedemo.com/cart.html')
    })

})

test.describe('Checkout step two', () => {

    test.beforeEach(async ({ page }) => {
        await page.locator('[data-test="firstName"]').type('asd123')
        await page.locator('[data-test="lastName"]').type('asd123')
        await page.locator('[data-test="postalCode"]').type('1880')
        await page.locator('[id="continue"]').click()
    })

    test('Check price and items added', async ({ page }) => {
        //Check the items added on inventory page and their price are the same
        await expect(page.locator('body')).toContainText(item1Title)
        await expect(page.locator('body')).toContainText(item2Title)
        await expect(page.locator('body')).toContainText(item1Price)
        await expect(page.locator('body')).toContainText(item2Price)
    })

    test('Check Total price + taxes are greater than item prices', async ({ page }) => {
        let totalPrice: any = await page.locator('.summary_info_label.summary_total_label').textContent()
        let totalPriceFloated = parseFloat(totalPrice.replace('Total: $', ''))
        let item1PriceFloated = parseFloat(item1Price.replace('$', ''))
        let item2PriceFloated = parseFloat(item2Price.replace('$', ''))
        let itemPriceTotal = item1PriceFloated + item2PriceFloated

        console.log(item1PriceFloated)
        console.log(item2PriceFloated)
        console.log(itemPriceTotal)
        console.log(totalPriceFloated)

        //Always greater than because in this case there will be taxes and without discounts (limited page option for this testing)
        await expect(totalPriceFloated).toBeGreaterThan(parseFloat(item1Price.replace('$', '')))
        await expect(totalPriceFloated).toBeGreaterThan(parseFloat(item2Price.replace('$', '')))
        await expect(totalPriceFloated).toBeGreaterThan(itemPriceTotal)


    })


    test('Cancel', async ({ page }) => {
        await page.getByText('Cancel').click()
        await page.waitForURL('https://www.saucedemo.com/inventory.html')
    })

    test('Finish', async ({ page }) => {
        await page.getByText('Finish').click()
        await page.waitForURL('https://www.saucedemo.com/checkout-complete.html')
    })

    test('Checkout complete + Back Home', async ({ page }) => {
        await page.getByText('Finish').click()
        await page.waitForURL('https://www.saucedemo.com/checkout-complete.html')
        await page.getByText('Back Home').click()
        await page.waitForURL('https://www.saucedemo.com/inventory.html')
    })


})