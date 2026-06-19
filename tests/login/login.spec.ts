import { test, expect } from '../../fixtures';
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

  test('Validar que site abre com sucesso', async ({ page, step }) => {
    await step('Validar URL da página de login', async () => {
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    await step('Validar logo Swag Labs visível', async () => {
      await expect(loginPage.logo).toBeVisible();
      await expect(loginPage.logo).toHaveText('Swag Labs');
    });

    await step('Validar campos de login visíveis', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test('Validar Login Com Sucesso', async ({ page, step }) => {
    await step('Realizar login com credenciais válidas', async () => {
      await loginPage.login(VALID_USER, VALID_PASSWORD);
    });

    await step('Validar redirecionamento para a home', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
    });
  });

  test('Validar Login Com Falha', async ({ step }) => {
    await step('Tentar login com senha incorreta', async () => {
      await loginPage.login(VALID_USER, WRONG_PASSWORD);
    });

    await step('Validar mensagem de erro de credencial inválida', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        'Username and password do not match any user in this service'
      );
    });
  });

  test('Validar Login Com Campos Vazios', async ({ step }) => {
    await step('Clicar em login sem preencher campos', async () => {
      await loginPage.loginButton.click();
    });

    await step('Validar mensagem de campo obrigatório', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Username is required');
    });
  });

  test('Validar Login Com Usuario Bloqueado', async ({ step }) => {
    await step('Tentar login com usuário bloqueado', async () => {
      await loginPage.login(LOCKED_USER, VALID_PASSWORD);
    });

    await step('Validar mensagem de usuário bloqueado', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
    });
  });

  test('Validar Logout', async ({ page, step }) => {
    await step('Realizar login com credenciais válidas', async () => {
      await loginPage.login(VALID_USER, VALID_PASSWORD);
      await expect(page).toHaveURL(/.*inventory\.html/);
    });

    await step('Abrir menu e clicar em logout', async () => {
      const homePage = new HomePage(page);
      await homePage.logout();
    });

    await step('Validar retorno à tela de login', async () => {
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});
