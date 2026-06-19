import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // Menu lateral
  readonly hamburgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly aboutLink: Locator;
  readonly allItemsLink: Locator;

  // Inventário
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productImages: Locator;
  readonly addToCartButtons: Locator;

  // Ordenação e carrinho
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink    = page.locator('#logout_sidebar_link');
    this.aboutLink     = page.locator('#about_sidebar_link');
    this.allItemsLink  = page.locator('#inventory_sidebar_link');

    this.inventoryContainer = page.locator('.inventory_list');
    this.inventoryItems     = page.locator('.inventory_item');
    this.productNames       = page.locator('.inventory_item_name');
    this.productPrices      = page.locator('.inventory_item_price');
    this.productImages      = page.locator('.inventory_item_img img');
    this.addToCartButtons   = page.locator('.btn_inventory');

    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge    = page.locator('.shopping_cart_badge');
  }

  async openMenu() {
    await this.hamburgerMenu.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async clickAbout() {
    await this.openMenu();
    await this.aboutLink.click();
  }

  async clickAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async selectSort(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async addFirstItemToCart() {
    await this.addToCartButtons.first().click();
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map(p => parseFloat(p.replace('$', '')));
  }
}
