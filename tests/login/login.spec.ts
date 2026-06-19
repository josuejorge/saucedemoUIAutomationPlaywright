import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Page', () => {
  test('Validar que site abre com sucesso', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.logo).toBeVisible();
    await expect(loginPage.logo).toHaveText('Swag Labs');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
