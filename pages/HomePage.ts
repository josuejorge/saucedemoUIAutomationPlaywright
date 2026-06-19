import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly hamburgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly inventoryContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hamburgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.inventoryContainer = page.locator('#inventory_container');
  }

  async logout() {
    await this.hamburgerMenu.click();
    await this.logoutLink.click();
  }
}
