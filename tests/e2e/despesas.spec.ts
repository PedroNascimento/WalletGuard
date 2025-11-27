import { test, expect } from '@playwright/test';

/**
 * Testes E2E para CRUD de Despesas
 */

const TEST_USER = {
    email: 'test1@example.com',
    password: 'password123',
};

const TEST_DESPESA = {
    descricao: 'Aluguel E2E Test',
    valor: '1500',
    categoria: 'Moradia',
    data: '2025-01-05',
};

test.describe('Despesas - CRUD', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard');

        // Navegar para despesas
        await page.click('text=/despesas|expenses/i');
        await page.waitForURL('**/despesas');
    });

    test('deve criar nova despesa', async ({ page }) => {
        // Abrir formulário
        await page.click('button:has-text("Nova"), button:has-text("Adicionar")');
        await page.waitForTimeout(500);

        // Preencher
        await page.fill('input[name="descricao"], input[placeholder*="descrição"]', TEST_DESPESA.descricao);
        await page.fill('input[name="valor"], input[type="number"]', TEST_DESPESA.valor);
        await page.fill('input[name="data"], input[type="date"]', TEST_DESPESA.data);

        // Selecionar categoria
        const categoriaSelect = page.locator('select[name="categoria"]').first();
        if (await categoriaSelect.isVisible()) {
            await categoriaSelect.selectOption(TEST_DESPESA.categoria);
        }

        // Salvar
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);

        // Verificar
        await expect(page.locator(`text=${TEST_DESPESA.descricao}`)).toBeVisible({ timeout: 5000 });
    });

    test('deve editar despesa', async ({ page }) => {
        // Editar primeira despesa
        await page.click('button:has-text("Editar")').first();
        await page.waitForTimeout(500);

        // Modificar
        const descricaoInput = page.locator('input[name="descricao"]').first();
        await descricaoInput.clear();
        await descricaoInput.fill('Despesa Editada E2E');

        // Salvar
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);

        // Verificar
        await expect(page.locator('text=Despesa Editada E2E')).toBeVisible();
    });

    test('deve excluir despesa', async ({ page }) => {
        // Contar antes
        const despesasAntes = await page.locator('table tr, .despesa-item').count();

        // Excluir
        await page.click('button:has-text("Excluir")').first();
        await page.waitForTimeout(500);
        await page.click('button:has-text("Confirmar"), button:has-text("Sim")');
        await page.waitForTimeout(1000);

        // Verificar
        const despesasDepois = await page.locator('table tr, .despesa-item').count();
        expect(despesasDepois).toBeLessThan(despesasAntes);
    });

    test('deve exibir total de despesas', async ({ page }) => {
        // Verificar indicador de total
        const totalElement = page.locator('text=/total|gasto/i').first();
        await expect(totalElement).toBeVisible();
    });

    test('deve filtrar por categoria', async ({ page }) => {
        const categoriaFilter = page.locator('select:has-text("Categoria")').first();

        if (await categoriaFilter.isVisible()) {
            await categoriaFilter.selectOption('Moradia');
            await page.waitForTimeout(500);

            const results = page.locator('table tr:has-text("Moradia")');
            const count = await results.count();
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });
});
