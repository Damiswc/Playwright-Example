import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()
    await page.waitForURL('https://www.saucedemo.com/inventory.html')
})


test('Add to cart', async ({ page }) => {
    await page.getByText('Add to cart').first().click()

    //Check Cart icon to have set 1 item
    await expect(page.locator('.shopping_cart_badge')).toContainText('1')

    //Add to cart should disappear as primary button and appear secundary button (remove button)
    //Double type of assert by text and by class
    await expect(page.locator('.inventory_item').first().locator('.btn_primary')).not.toBeVisible()
    await expect(page.locator('.inventory_item').first().locator('.btn_secondary')).toBeVisible()
    await expect(page.getByText('Remove')).toBeVisible()
    await expect(page.locator('.inventory_item').first().getByText('Add to cart')).not.toBeVisible()

    //Add 2 items and check the cart
    await page.getByText('Add to cart').first().click()
    await page.getByText('Add to cart').nth(1).click()

    await expect(page.locator('.shopping_cart_badge')).toContainText('3')

})

test('Remove items', async ({ page }) => {
    await page.getByText('Add to cart').first().click()
    //Add to cart should disappear as primary button and appear secundary button (remove button)
    //Double type of assert by text and by class
    await expect(page.locator('.inventory_item').first().locator('.btn_primary')).not.toBeVisible()
    await expect(page.locator('.inventory_item').first().locator('.btn_secondary')).toBeVisible()
    await expect(page.getByText('Remove')).toBeVisible()
    await expect(page.locator('.inventory_item').first().getByText('Add to cart')).not.toBeVisible()

    await page.getByText('Remove').click()

    //This class shouldn't be visible because there's no item (0)
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible()

    //Check

    await expect(page.locator('.inventory_item').first().locator('.btn_primary')).toBeVisible()
    await expect(page.locator('.inventory_item').first().locator('.btn_secondary')).not.toBeVisible()
    await expect(page.getByText('Remove')).not.toBeVisible()
    await expect(page.locator('.inventory_item').first().getByText('Add to cart')).toBeVisible()

    //Add 2 items
    await page.getByText('Add to cart').nth(1).click()
    await page.getByText('Add to cart').first().click()


    await expect(page.locator('.shopping_cart_badge')).toContainText('2')

    //Remove 2 items and check the cart
    await page.getByText('Remove').nth(1).click()
    await page.getByText('Remove').first().click()

    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible()
})

test.describe('Filter', () => {

    test('Name (A to Z)', async ({ page }) => {

        await page.locator('.select_container').click()
        await page.locator('.product_sort_container').selectOption({ value: 'lohi' })
        await expect(page.locator('.active_option')).toContainText('Price (low to high)')

        //Check to change option selected
        await page.locator('.select_container').click()
        await page.locator('.product_sort_container').selectOption({ value: 'az' })
        await expect(page.locator('.active_option')).toContainText('Name (A to Z)')

        let itemTitles = await page.locator('.inventory_item_name').allTextContents()

        //Sort A to Z 
        let itemTitlesSorted = itemTitles.sort()

        let cantTitles = await page.locator('.inventory_item_name').count()

        for (let i = 0; i < cantTitles; i++) {
            await expect(page.locator('.inventory_item_name').nth(i)).toContainText(itemTitlesSorted[i])
        }

    })

    test('Name (Z to A)', async ({ page }) => {
        await page.locator('.select_container').click()
        await page.locator('select.product_sort_container').selectOption({ value: 'za' })
        await expect(page.locator('.active_option')).toContainText('Name (Z to A)')

        let itemTitles = await page.locator('.inventory_item_name').allTextContents()

        //Sort A to Z and reversed
        let itemTitlesSorted = itemTitles.sort().reverse()

        let cantTitles = await page.locator('.inventory_item_name').count()

        for (let i = 0; i < cantTitles; i++) {
            await expect(page.locator('.inventory_item_name').nth(i)).toContainText(itemTitlesSorted[i])
        }



    })

    test('Price (low to high)', async ({ page }) => {
        await page.locator('.select_container').click()
        await page.locator('.product_sort_container').selectOption({ value: 'lohi' })
        await expect(page.locator('.active_option')).toContainText('Price (low to high)')

        let itemPrices = await page.locator('.inventory_item_price').allTextContents()
        console.log(itemPrices)
        let cantPrices = await page.locator('.inventory_item_price').count()
        let itemPrice1, itemPrice2

        for (let i = 0; i < cantPrices; i++) {

            if (i != cantPrices - 1) {
                itemPrice1 = parseFloat(itemPrices[i].replace('$', ''))
                itemPrice2 = parseFloat(itemPrices[i + 1].replace('$', ''))
                await expect(itemPrice1).toBeLessThanOrEqual(itemPrice2)
            }


        }


    })

    test('Price (high to low)', async ({ page }) => {
        await page.locator('.select_container').click()
        await page.locator('.product_sort_container').selectOption({ value: 'hilo' })
        await expect(page.locator('.active_option')).toContainText('Price (high to low)')

        let itemPrices = await page.locator('.inventory_item_price').allTextContents()
        console.log(itemPrices)
        let cantPrices = await page.locator('.inventory_item_price').count()
        let itemPrice1, itemPrice2

        for (let i = 0; i < cantPrices; i++) {

            if (i != cantPrices - 1) {
                itemPrice1 = parseFloat(itemPrices[i].replace('$', ''))
                itemPrice2 = parseFloat(itemPrices[i + 1].replace('$', ''))
                await expect(itemPrice1).toBeGreaterThanOrEqual(itemPrice2)
            }


        }

    })


})