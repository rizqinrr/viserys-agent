// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  outputDir: '/tmp/playwright-results',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never', outputFolder: '/tmp/playwright-report' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    // Explicitly use Brave Browser on Linux
    launchOptions: {
      executablePath: process.env.BRAVE_PATH || '/usr/bin/brave-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--password-store=basic',
        '--use-mock-keychain',
      ],
    },
  },
  projects: [
    {
      name: 'brave-desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'brave-mobile',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 4173 --directory site',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 10 * 1000,
  },
});
