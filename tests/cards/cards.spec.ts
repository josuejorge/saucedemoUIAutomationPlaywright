import { test, expect } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

const VALID_USER     = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('Cards / Produtos', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await page.waitForURL(/.*inventory\.html/);

    homePage    = new HomePage(page);
    productPage = new ProductPage(page);
  });

  test('Validar Card de produto na home', async ({ step }) => {
    await step('Validar nome do produto visível', async () => {
      await expect(homePage.productNames.first()).toBeVisible();
    });

    await step('Validar preço do produto no formato correto', async () => {
      await expect(homePage.productPrices.first()).toBeVisible();
      const price = await homePage.productPrices.first().textContent();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });

    await step('Validar imagem do produto visível', async () => {
      await expect(homePage.productImages.first()).toBeVisible();
    });

    await step('Validar botão Add to cart visível', async () => {
      await expect(homePage.addToCartButtons.first()).toBeVisible();
    });
  });

  test('Validar adicionar produto ao carrinho', async ({ step }) => {
    await step('Clicar em Add to cart no primeiro produto', async () => {
      await homePage.addToCartButtons.first().click();
    });

    await step('Validar badge do carrinho exibe 1', async () => {
      await expect(homePage.cartBadge).toBeVisible();
      await expect(homePage.cartBadge).toHaveText('1');
    });

    await step('Validar botão mudou para Remove', async () => {
      await expect(homePage.removeFromCartButtons.first()).toBeVisible();
    });
  });

  test('Validar adicionar multiplos produtos ao carrinho', async ({ step }) => {
    await step('Adicionar primeiro produto ao carrinho', async () => {
      await homePage.addToCartButtons.first().click();
      await expect(homePage.cartBadge).toHaveText('1');
    });

    await step('Adicionar segundo produto ao carrinho', async () => {
      await homePage.addToCartButtons.first().click();
      await expect(homePage.cartBadge).toHaveText('2');
    });

    await step('Validar badge do carrinho exibe 2', async () => {
      await expect(homePage.cartBadge).toHaveText('2');
    });
  });

  test('Validar remover produto do carrinho', async ({ step }) => {
    await step('Adicionar produto ao carrinho', async () => {
      await homePage.addToCartButtons.first().click();
      await expect(homePage.cartBadge).toHaveText('1');
    });

    await step('Remover produto pelo botão Remove no card', async () => {
      await homePage.removeFromCartButtons.first().click();
    });

    await step('Validar badge do carrinho desapareceu', async () => {
      await expect(homePage.cartBadge).not.toBeVisible();
    });

    await step('Validar botão voltou para Add to cart', async () => {
      await expect(homePage.addToCartButtons.first()).toBeVisible();
    });
  });

  test('Validar detalhes do produto', async ({ page, step }) => {
    await step('Clicar no nome do produto para ver detalhes', async () => {
      await homePage.productNames.first().click();
      await expect(page).toHaveURL(/.*inventory-item\.html/);
    });

    await step('Validar nome do produto na tela de detalhes', async () => {
      await expect(productPage.productName).toBeVisible();
    });

    await step('Validar preço na tela de detalhes', async () => {
      await expect(productPage.productPrice).toBeVisible();
      const price = await productPage.productPrice.textContent();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });

    await step('Validar imagem e descrição visíveis', async () => {
      await expect(productPage.productImage).toBeVisible();
      await expect(productPage.productDescription).toBeVisible();
    });
  });

  test('Validar botao back to products', async ({ page, step }) => {
    await step('Navegar para a tela de detalhes do produto', async () => {
      await homePage.productNames.first().click();
      await expect(page).toHaveURL(/.*inventory-item\.html/);
    });

    await step('Clicar em Back to products', async () => {
      await productPage.goBackToProducts();
    });

    await step('Validar retorno ao inventário', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(homePage.inventoryItems.first()).toBeVisible();
    });
  });

  test('Validar adicionar produto dentro da tela de detalhes', async ({ page, step }) => {
    await step('Navegar para a tela de detalhes do produto', async () => {
      await homePage.productNames.first().click();
      await expect(page).toHaveURL(/.*inventory-item\.html/);
    });

    await step('Adicionar produto ao carrinho pela tela de detalhes', async () => {
      await productPage.addToCart();
    });

    await step('Validar badge do carrinho exibe 1', async () => {
      await expect(homePage.cartBadge).toBeVisible();
      await expect(homePage.cartBadge).toHaveText('1');
    });

    await step('Validar botão mudou para Remove na tela de detalhes', async () => {
      await expect(productPage.removeFromCartButton).toBeVisible();
    });
  });
});
