// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Viserys Web Showcase (Brave Browser E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads home page with hero headline and canvas', async ({ page }) => {
    await expect(page).toHaveTitle(/Viserys/);

    const headline = page.locator('.hero-headline');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Engineering Workflow Pack untuk AI Coding Agents.');

    // Verify SonarGrid canvas is present
    const canvas = page.locator('#sonar-grid-canvas');
    await expect(canvas).toBeAttached();

    // Verify Hero Section can be clicked to emit sonar ring
    await page.locator('#hero').click({ position: { x: 200, y: 200 } });
  });

  test('toggles theme between Dark and Light mode', async ({ page }) => {
    const html = page.locator('html');
    const menuBtn = page.locator('#mobile-menu-btn');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
    }
    const themeBtn = page.locator('#theme-toggle');

    // Default is dark mode
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#theme-icon-sun')).toBeVisible();

    // Switch to light mode
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('#theme-icon-moon')).toBeVisible();

    // Switch back to dark mode
    await themeBtn.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('copies installation command on click', async ({ page }) => {
    const copyBtn = page.locator('#copy-btn');
    await expect(copyBtn).toBeVisible();

    await copyBtn.click();
    await expect(copyBtn).toHaveClass(/copied/);
  });

  test('switches interactive workbench tabs and states', async ({ page }) => {
    const prdTab = page.locator('#tab-btn-prd');
    const tasksTab = page.locator('#tab-btn-tasks');
    const designTab = page.locator('#tab-btn-design');
    const fileLabel = page.locator('#wb-file-label');

    // Default stage is PRD
    await expect(fileLabel).toHaveText('docs/PRD.md');

    // Switch to tasks
    await tasksTab.click();
    await expect(tasksTab).toHaveAttribute('aria-selected', 'true');
    await expect(fileLabel).toHaveText('tasks/inventory/task-02.md');

    // Switch to design
    await designTab.click();
    await expect(designTab).toHaveAttribute('aria-selected', 'true');
    await expect(fileLabel).toHaveText('docs/design.md');

    // Switch back to PRD
    await prdTab.click();
    await expect(fileLabel).toHaveText('docs/PRD.md');

    // Test UI State Switcher: Empty State
    const emptyBtn = page.locator('.state-btn[data-state="empty"]');
    await emptyBtn.click();
    await expect(page.locator('#wb-view-empty')).toBeVisible();

    // Recover back to ready
    const startBtn = page.locator('#empty-start-btn');
    await startBtn.click();
    await expect(page.locator('#wb-view-ready')).toBeVisible();
  });

  test('switches cross-harness adapter tabs', async ({ page }) => {
    const antigravityBtn = page.locator('.adapter-btn[data-harness="antigravity"]');
    const opencodeBtn = page.locator('.adapter-btn[data-harness="opencode"]');
    const cmdBox = page.locator('#adapter-cmd');

    // Click Antigravity
    await antigravityBtn.click();
    await expect(cmdBox).toContainText('--agent antigravity');

    // Click OpenCode
    await opencodeBtn.click();
    await expect(cmdBox).toContainText('--agent opencode');
  });
});
