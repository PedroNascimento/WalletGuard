import { test, expect } from '@playwright/test';

/**
 * Testes E2E para fluxo de autenticação
 */

const TEST_USER = {
    email: 'test1@example.com',
    password: 'password123',
};

const NEW_USER = {
    email: `test-${Date.now()}@example.com`,
    password: 'NewPassword123!',
    name: 'Test User E2E',
};

test.describe('Autenticação', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test.describe('Login', () => {
        test('deve fazer login com credenciais válidas', async ({ page }) => {
            // Verificar que está na página de login
            await expect(page).toHaveTitle(/WalletGuard/);

            // Preencher formulário de login
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);

            // Clicar no botão de login
            await page.click('button[type="submit"]');

            // Aguardar redirecionamento para dashboard
            await page.waitForURL('**/dashboard', { timeout: 10000 });

            // Verificar que está no dashboard
            await expect(page.locator('h1')).toContainText(/Dashboard|Painel/i);

            // Verificar que o menu de navegação está visível
            await expect(page.locator('nav')).toBeVisible();
        });

        test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
            // Preencher com credenciais inválidas
            await page.fill('input[type="email"]', 'invalid@example.com');
            await page.fill('input[type="password"]', 'wrongpassword');

            // Tentar fazer login
            await page.click('button[type="submit"]');

            // Aguardar mensagem de erro
            await expect(page.locator('text=/credenciais|inválid|erro/i')).toBeVisible({ timeout: 5000 });

            // Verificar que ainda está na página de login
            await expect(page.locator('input[type="email"]')).toBeVisible();
        });

        test('deve validar campos obrigatórios', async ({ page }) => {
            // Tentar submeter sem preencher
            await page.click('button[type="submit"]');

            // Verificar validação HTML5
            const emailInput = page.locator('input[type="email"]');
            await expect(emailInput).toHaveAttribute('required');

            const passwordInput = page.locator('input[type="password"]');
            await expect(passwordInput).toHaveAttribute('required');
        });

        test('deve permitir visualizar senha', async ({ page }) => {
            const passwordInput = page.locator('input[type="password"]');
            await passwordInput.fill('mypassword');

            // Verificar que o tipo é password
            await expect(passwordInput).toHaveAttribute('type', 'password');

            // Clicar no botão de mostrar senha (se existir)
            const showPasswordBtn = page.locator('button:has-text("Mostrar"), button[aria-label*="password"]').first();
            if (await showPasswordBtn.isVisible()) {
                await showPasswordBtn.click();

                // Verificar que mudou para text
                await expect(page.locator('input[type="text"]').first()).toBeVisible();
            }
        });
    });

    test.describe('Cadastro', () => {
        test('deve criar nova conta com sucesso', async ({ page }) => {
            // Navegar para página de cadastro
            await page.click('text=/cadastr|sign up|criar conta/i');

            // Preencher formulário
            await page.fill('input[name="name"], input[placeholder*="nome"]', NEW_USER.name);
            await page.fill('input[type="email"]', NEW_USER.email);
            await page.fill('input[type="password"]', NEW_USER.password);

            // Confirmar senha se necessário
            const confirmPasswordInput = page.locator('input[placeholder*="confirmar"], input[name="confirmPassword"]');
            if (await confirmPasswordInput.isVisible()) {
                await confirmPasswordInput.fill(NEW_USER.password);
            }

            // Submeter formulário
            await page.click('button[type="submit"]');

            // Aguardar sucesso (pode redirecionar ou mostrar mensagem)
            await page.waitForTimeout(2000);

            // Verificar que foi criado (dashboard ou mensagem de confirmação)
            const isOnDashboard = await page.locator('h1:has-text("Dashboard")').isVisible().catch(() => false);
            const hasSuccessMessage = await page.locator('text=/sucesso|confirmação|email enviado/i').isVisible().catch(() => false);

            expect(isOnDashboard || hasSuccessMessage).toBeTruthy();
        });

        test('deve validar formato de email', async ({ page }) => {
            // Navegar para cadastro
            await page.click('text=/cadastr|sign up/i');

            // Preencher com email inválido
            await page.fill('input[type="email"]', 'invalid-email');
            await page.fill('input[type="password"]', 'Password123!');

            // Tentar submeter
            await page.click('button[type="submit"]');

            // Verificar validação HTML5
            const emailInput = page.locator('input[type="email"]');
            const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(validationMessage).toBeTruthy();
        });

        test('deve validar força da senha', async ({ page }) => {
            // Navegar para cadastro
            await page.click('text=/cadastr|sign up/i');

            // Preencher com senha fraca
            await page.fill('input[type="email"]', 'test@example.com');
            await page.fill('input[type="password"]', '123');

            // Verificar indicador de força (se existir)
            const strengthIndicator = page.locator('text=/fraca|weak|forte|strong/i');
            if (await strengthIndicator.isVisible()) {
                await expect(strengthIndicator).toContainText(/fraca|weak/i);
            }
        });
    });

    test.describe('Recuperação de Senha', () => {
        test('deve enviar email de recuperação', async ({ page }) => {
            // Clicar em "Esqueci minha senha"
            await page.click('text=/esqueci|forgot|recuperar/i');

            // Preencher email
            await page.fill('input[type="email"]', TEST_USER.email);

            // Submeter
            await page.click('button[type="submit"]');

            // Aguardar mensagem de sucesso
            await expect(page.locator('text=/email enviado|check your email|sucesso/i')).toBeVisible({ timeout: 5000 });
        });

        test('deve validar email na recuperação', async ({ page }) => {
            // Clicar em recuperar senha
            await page.click('text=/esqueci|forgot/i');

            // Tentar submeter sem email
            await page.click('button[type="submit"]');

            // Verificar validação
            const emailInput = page.locator('input[type="email"]');
            await expect(emailInput).toHaveAttribute('required');
        });
    });

    test.describe('Logout', () => {
        test('deve fazer logout com sucesso', async ({ page }) => {
            // Fazer login primeiro
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');

            // Aguardar dashboard
            await page.waitForURL('**/dashboard');

            // Clicar no menu de usuário
            await page.click('button:has-text("Perfil"), button[aria-label*="menu"], button:has-text("Sair")');

            // Clicar em logout/sair
            await page.click('text=/sair|logout|sign out/i');

            // Aguardar redirecionamento para login
            await page.waitForURL('**/login', { timeout: 5000 });

            // Verificar que está na página de login
            await expect(page.locator('input[type="email"]')).toBeVisible();
        });

        test('deve limpar sessão após logout', async ({ page }) => {
            // Fazer login
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL('**/dashboard');

            // Fazer logout
            await page.click('button:has-text("Sair"), text=/sair|logout/i');
            await page.waitForURL('**/login');

            // Tentar acessar dashboard diretamente
            await page.goto('/dashboard');

            // Deve redirecionar para login
            await page.waitForURL('**/login', { timeout: 5000 });
        });
    });

    test.describe('Persistência de Sessão', () => {
        test('deve manter sessão após reload', async ({ page }) => {
            // Fazer login
            await page.fill('input[type="email"]', TEST_USER.email);
            await page.fill('input[type="password"]', TEST_USER.password);
            await page.click('button[type="submit"]');
            await page.waitForURL('**/dashboard');

            // Recarregar página
            await page.reload();

            // Verificar que ainda está autenticado
            await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 5000 });
        });

        test('deve redirecionar para login se não autenticado', async ({ page }) => {
            // Tentar acessar página protegida
            await page.goto('/dashboard');

            // Deve redirecionar para login
            await page.waitForURL('**/login', { timeout: 5000 });
            await expect(page.locator('input[type="email"]')).toBeVisible();
        });
    });
});
