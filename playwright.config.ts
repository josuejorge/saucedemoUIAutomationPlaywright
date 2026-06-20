import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  globalSetup: './global-setup.ts',
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['./reporters/evidence-reporter.ts'],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    storageState: '.auth/user.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
