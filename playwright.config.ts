import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests/e2e',

    /* Executar testes em paralelo */
    fullyParallel: true,

    /* Falhar o build no CI se você acidentalmente deixou test.only */
    forbidOnly: !!process.env.CI,

    /* Retry em CI apenas */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests no CI */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter para usar */
    reporter: [
        ['html', { outputFolder: 'reports/playwright-report' }],
        ['json', { outputFile: 'reports/playwright-results.json' }],
        ['list']
    ],

    /* Configurações compartilhadas para todos os projetos */
    use: {
        /* URL base para usar em ações como `await page.goto('/')` */
        baseURL: process.env.VITE_BASE_URL || 'http://localhost:5173',

        /* Coletar trace quando retry em falha */
        trace: 'on-first-retry',

        /* Screenshot em falha */
        screenshot: 'only-on-failure',

        /* Video em falha */
        video: 'retain-on-failure',
    },

    /* Configurar projetos para principais browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* Testes em mobile viewports */
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    /* Executar servidor de desenvolvimento antes de iniciar os testes */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
