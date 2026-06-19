import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems             = page.locator('.cart_item');
    this.cartItemNames         = page.locator('.cart_item .inventory_item_name');
    this.removeButtons         = page.locator('[data-test^="remove"]');
    this.checkoutButton        = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async removeFirstItem() {
    await this.removeButtons.first().click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
