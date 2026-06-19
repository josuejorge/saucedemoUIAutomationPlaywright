import { test, expect } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

const VALID_USER = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await page.waitForURL(/.*inventory\.html/);
    homePage = new HomePage(page);
  });

  test('Validar Homepage', async ({ page, step }) => {
    await step('Validar URL da home', async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
    });

    await step('Validar container de inventário visível', async () => {
      await expect(homePage.inventoryContainer).toBeVisible();
    });

    await step('Validar que existem produtos listados', async () => {
      await expect(homePage.inventoryItems).toHaveCount(6);
    });
  });

  test('Validar Card De Produto Na Home', async ({ step }) => {
    await step('Validar nome do produto visível', async () => {
      await expect(homePage.productNames.first()).toBeVisible();
    });

    await step('Validar preço do produto visível', async () => {
      await expect(homePage.productPrices.first()).toBeVisible();
      const price = await homePage.productPrices.first().textContent();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });

    await step('Validar imagem do produto visível', async () => {
      await expect(homePage.productImages.first()).toBeVisible();
    });

    await step('Validar botão adicionar ao carrinho', async () => {
      await expect(homePage.addToCartButtons.first()).toBeVisible();
      await expect(homePage.addToCartButtons.first()).toContainText('Add to cart');
    });
  });

  test('Validar about', async ({ page, step }) => {
    await step('Abrir menu hamburguer', async () => {
      await homePage.openMenu();
      await expect(homePage.aboutLink).toBeVisible();
    });

    await step('Clicar em About e validar navegação', async () => {
      await homePage.aboutLink.click();
      await expect(page).toHaveURL(/saucelabs\.com/);
    });
  });

  test('Validar all items', async ({ page, step }) => {
    await step('Abrir menu hamburguer', async () => {
      await homePage.openMenu();
      await expect(homePage.allItemsLink).toBeVisible();
    });

    await step('Clicar em All Items e validar inventário', async () => {
      await homePage.allItemsLink.click();
      await expect(page).toHaveURL(/.*inventory\.html/);
      await expect(homePage.inventoryItems.first()).toBeVisible();
    });
  });

  test('Validar Carrinho persistido após reload na tela', async ({ page, step }) => {
    await step('Adicionar primeiro produto ao carrinho', async () => {
      await homePage.addFirstItemToCart();
      await expect(homePage.cartBadge).toHaveText('1');
    });

    await step('Recarregar a página', async () => {
      await page.reload();
      await page.waitForURL(/.*inventory\.html/);
    });

    await step('Validar que o carrinho manteve o item', async () => {
      await expect(homePage.cartBadge).toBeVisible();
      await expect(homePage.cartBadge).toHaveText('1');
    });
  });

  test('Validar ordenar produtos Name (A to Z)', async ({ step }) => {
    await step('Selecionar ordenação A to Z', async () => {
      await homePage.selectSort('az');
    });

    await step('Validar que produtos estão em ordem alfabética crescente', async () => {
      const names = await homePage.getProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    });
  });

  test('Validar ordenar produtos Name (Z to A)', async ({ step }) => {
    await step('Selecionar ordenação Z to A', async () => {
      await homePage.selectSort('za');
    });

    await step('Validar que produtos estão em ordem alfabética decrescente', async () => {
      const names = await homePage.getProductNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });
  });

  test('Validar ordenar produtos Price (Low to High)', async ({ step }) => {
    await step('Selecionar ordenação Price (Low to High)', async () => {
      await homePage.selectSort('lohi');
    });

    await step('Validar que preços estão em ordem crescente', async () => {
      const prices = await homePage.getProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });
  });

  test('Validar ordenar produtos Price (High to Low)', async ({ step }) => {
    await step('Selecionar ordenação Price (High to Low)', async () => {
      await homePage.selectSort('hilo');
    });

    await step('Validar que preços estão em ordem decrescente', async () => {
      const prices = await homePage.getProductPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });
  });
});
