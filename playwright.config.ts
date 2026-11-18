import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    ...(process.env.CI ? {} : { channel: 'chrome' }),
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Large (1920px)',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Desktop (1440px)',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Laptop (1280px)',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Tablet (768px)',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Mobile (390px)',
      use: {
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'Small Mobile (360px)',
      use: {
        viewport: { width: 360, height: 740 },
      },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
