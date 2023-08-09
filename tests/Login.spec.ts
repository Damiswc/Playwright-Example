import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
})


test('Log in', async ({ page }) => {


  await page.locator('[data-test="username"]').type('standard_user')
  await page.locator('[data-test="password"]').type('secret_sauce')
  await page.locator('[id="login-button"]').click()

  await page.waitForURL('https://www.saucedemo.com/inventory.html')
});

test.describe('Wrong credencials', () => {
  test('Wrong password', async ({ page }) => {

    await page.locator('[data-test="username"]').type('standard_user')
    await page.locator('[data-test="password"]').type('secret')
    await page.locator('[id="login-button"]').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible()
    await expect(page.locator('[data-test="username"]')).toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

    await expect(page.locator('[data-test="password"]')).toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()



    //Now close the error message and check opposite expects
    await page.locator('.error-button').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).not.toBeVisible()
    await expect(page.locator('[data-test="username"]')).not.toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()

    await expect(page.locator('[data-test="password"]')).not.toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()


  })

  test('Wrong username', async ({ page }) => {

    await page.locator('[data-test="username"]').type('standard_usersss')
    await page.locator('[data-test="password"]').type('secret_sauce')
    await page.locator('[id="login-button"]').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible()
    await expect(page.locator('[data-test="username"]')).toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

    await expect(page.locator('[data-test="password"]')).toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()



    //Now close the error message and check opposite expects
    await page.locator('.error-button').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).not.toBeVisible()
    await expect(page.locator('[data-test="username"]')).not.toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()

    await expect(page.locator('[data-test="password"]')).not.toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()


  })
})



test.describe("Don't match user and password", () => {

  test('Username required', async ({ page }) => {

    await page.locator('[data-test="password"]').type('secrets')
    await page.locator('[id="login-button"]').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible()
    await expect(page.locator('[data-test="username"]')).toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

    await expect(page.locator('[data-test="password"]')).toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()



    //Now close the error message and check opposite expects
    await page.locator('.error-button').click()

    //Error message
    await expect(page.getByText('Epic sadface: Username is required')).not.toBeVisible()
    await expect(page.locator('[data-test="username"]')).not.toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()

    await expect(page.locator('[data-test="password"]')).not.toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()
  })


  test('Password required', async ({ page }) => {

    await page.locator('[data-test="username"]').type('random_user')

    await page.locator('[id="login-button"]').click()

    //Error message
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible()
    await expect(page.locator('[data-test="username"]')).toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()

    await expect(page.locator('[data-test="password"]')).toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).toBeVisible()



    //Now close the error message and check opposite expects
    await page.locator('.error-button').click()

    //Error message
    await expect(page.getByText('Epic sadface: Password is required')).not.toBeVisible()
    await expect(page.locator('[data-test="username"]')).not.toHaveClass('input_error form_input error')
    //This is error icon
    await expect(page.locator('[data-test="username"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()

    await expect(page.locator('[data-test="password"]')).not.toHaveClass('input_error form_input error')
    await expect(page.locator('[data-test="password"]').locator('..').locator('[data-icon="times-circle"]')).not.toBeVisible()
  })


})
