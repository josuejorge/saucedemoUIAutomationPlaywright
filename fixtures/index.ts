import { test as base } from '@playwright/test';

type StepFixture = {
  step: (name: string, fn: () => Promise<void>) => Promise<void>;
};

export const test = base.extend<StepFixture>({
  step: async ({ page }, use, testInfo) => {
    await use(async (name: string, fn: () => Promise<void>) => {
      await base.step(name, async () => {
        await fn();
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach(name, {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  },
});

export { expect } from '@playwright/test';
