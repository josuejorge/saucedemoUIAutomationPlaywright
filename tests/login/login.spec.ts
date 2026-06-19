import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const LOCKED_USER = 'locked_out_user';
const WRONG_PASSWORD = 'wrong_password';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Validar que site abre com sucesso', async ({ page }) => {
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.logo).toBeVisible();
    await expect(loginPage.logo).toHaveText('Swag Labs');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Validar Login Com Sucesso', async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Validar Login Com Falha', async ({ page }) => {
    await loginPage.login(VALID_USER, WRONG_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('Validar Login Com Campos Vazios', async () => {
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('Validar Login Com Usuario Bloqueado', async () => {
    await loginPage.login(LOCKED_USER, VALID_PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out'
    );
  });

  test('Validar Logout', async ({ page }) => {
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await expect(page).toHaveURL(/.*inventory\.html/);

    const homePage = new HomePage(page);
    await homePage.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
