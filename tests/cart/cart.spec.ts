import { test, expect } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const VALID_USER     = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const FIRST_NAME     = 'John';
const LAST_NAME      = 'Doe';
const ZIP_CODE       = '12345';

test.describe('Cart / Checkout', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await page.waitForURL(/.*inventory\.html/);

    homePage     = new HomePage(page);
    cartPage     = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await homePage.addFirstItemToCart();
  });

  test('Validar carrinho', async ({ page, step }) => {
    await step('Navegar para o carrinho', async () => {
      await cartPage.navigate();
      await expect(page).toHaveURL(/.*cart\.html/);
    });

    await step('Validar que o produto está no carrinho', async () => {
      await expect(cartPage.cartItems).toHaveCount(1);
      await expect(cartPage.cartItemNames.first()).toBeVisible();
    });

    await step('Validar botões do carrinho visíveis', async () => {
      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.continueShoppingButton).toBeVisible();
    });
  });

  test('Validar checkout sem informacao', async ({ page, step }) => {
    await step('Navegar para o carrinho e iniciar checkout', async () => {
      await cartPage.navigate();
      await cartPage.checkout();
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    });

    await step('Tentar continuar sem preencher informações', async () => {
      await checkoutPage.continue();
    });

    await step('Validar mensagem de erro de campo obrigatório', async () => {
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('Validar compra completa de produto', async ({ page, step }) => {
    await step('Navegar para o carrinho e iniciar checkout', async () => {
      await cartPage.navigate();
      await cartPage.checkout();
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    });

    await step('Preencher informações pessoais', async () => {
      await checkoutPage.fillInfo(FIRST_NAME, LAST_NAME, ZIP_CODE);
      await checkoutPage.continue();
      await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    });

    await step('Validar resumo do pedido e finalizar', async () => {
      await expect(checkoutPage.orderItems).toHaveCount(1);
      await checkoutPage.finish();
    });

    await step('Validar tela de compra concluída', async () => {
      await expect(page).toHaveURL(/.*checkout-complete\.html/);
      await expect(checkoutPage.completeHeader).toBeVisible();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });

  test('Validar remover pedido do carrinho', async ({ page, step }) => {
    await step('Navegar para o carrinho', async () => {
      await cartPage.navigate();
      await expect(cartPage.cartItems).toHaveCount(1);
    });

    await step('Remover produto do carrinho', async () => {
      await cartPage.removeFirstItem();
    });

    await step('Validar que o carrinho está vazio', async () => {
      await expect(cartPage.cartItems).toHaveCount(0);
      await expect(homePage.cartBadge).not.toBeVisible();
    });
  });

  test('Validar cancelar compra de produto', async ({ page, step }) => {
    await step('Navegar para o carrinho e iniciar checkout', async () => {
      await cartPage.navigate();
      await cartPage.checkout();
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    });

    await step('Cancelar na tela de informações', async () => {
      await checkoutPage.cancel();
    });

    await step('Validar retorno ao carrinho', async () => {
      await expect(page).toHaveURL(/.*cart\.html/);
      await expect(cartPage.cartItems).toHaveCount(1);
    });
  });
});
