import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName         = page.locator('.inventory_details_name');
    this.productDescription  = page.locator('.inventory_details_desc');
    this.productPrice        = page.locator('.inventory_details_price');
    this.productImage        = page.locator('.inventory_details_img');
    this.addToCartButton     = page.locator('[data-test^="add-to-cart"]');
    this.removeFromCartButton = page.locator('[data-test^="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goBackToProducts() {
    await this.backToProductsButton.click();
  }
}
