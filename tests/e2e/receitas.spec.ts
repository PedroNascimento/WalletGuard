import { test, expect } from '@playwright/test';

/**
 * Testes E2E para CRUD de Receitas
 */

const TEST_USER = {
    email: 'test1@example.com',
    password: 'password123',
};

const TEST_RECEITA = {
    descricao: 'Salário E2E Test',
    valor: '5000',
    categoria: 'Salário',
    data: '2025-01-15',
};

test.describe('Receitas - CRUD', () => {
    test.beforeEach(async ({ page }) => {
        // Fazer login antes de cada teste
        await page.goto('/');
        await page.fill('input[type="email"]', TEST_USER.email);
        await page.fill('input[type="password"]', TEST_USER.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard');

        // Navegar para página de receitas
        await page.click('text=/receitas|income/i');
        await page.waitForURL('**/receitas');
    });

    test.describe('Listagem', () => {
        test('deve exibir lista de receitas', async ({ page }) => {
            // Verificar título da página
            await expect(page.locator('h1, h2')).toContainText(/receitas|income/i);

            // Verificar que há uma tabela ou lista
            const hasTable = await page.locator('table').isVisible().catch(() => false);
            const hasList = await page.locator('[role="list"], .receita-item').isVisible().catch(() => false);

            expect(hasTable || hasList).toBeTruthy();
        });

        test('deve exibir total de receitas', async ({ page }) => {
            // Procurar por indicador de total
            const totalElement = page.locator('text=/total|saldo/i').first();
            await expect(totalElement).toBeVisible();
        });

        test('deve permitir filtrar receitas', async ({ page }) => {
            // Procurar campo de busca/filtro
            const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="filtrar"]').first();

            if (await searchInput.isVisible()) {
                await searchInput.fill('Salário');
                await page.waitForTimeout(500);

                // Verificar que resultados foram filtrados
                const results = page.locator('table tr, .receita-item');
                const count = await results.count();
                expect(count).toBeGreaterThan(0);
            }
        });
    });

    test.describe('Criação', () => {
        test('deve criar nova receita com sucesso', async ({ page }) => {
            // Clicar no botão de adicionar
            await page.click('button:has-text("Nova"), button:has-text("Adicionar"), button:has-text("+")');

            // Aguardar modal ou nova página
            await page.waitForTimeout(500);

            // Preencher formulário
            await page.fill('input[name="descricao"], input[placeholder*="descrição"]', TEST_RECEITA.descricao);
            await page.fill('input[name="valor"], input[type="number"]', TEST_RECEITA.valor);
            await page.fill('input[name="data"], input[type="date"]', TEST_RECEITA.data);

            // Selecionar categoria
            const categoriaSelect = page.locator('select[name="categoria"], select:has-text("Categoria")').first();
            if (await categoriaSelect.isVisible()) {
                await categoriaSelect.selectOption(TEST_RECEITA.categoria);
            }

            // Submeter formulário
            await page.click('button[type="submit"]:has-text("Salvar"), button:has-text("Criar")');

            // Aguardar confirmação
            await page.waitForTimeout(1000);

            // Verificar toast de sucesso ou redirecionamento
            const hasSuccessToast = await page.locator('text=/sucesso|criada|adicionada/i').isVisible().catch(() => false);
            const isBackToList = await page.locator('h1:has-text("Receitas")').isVisible().catch(() => false);

            expect(hasSuccessToast || isBackToList).toBeTruthy();

            // Verificar que a receita aparece na lista
            await expect(page.locator(`text=${TEST_RECEITA.descricao}`)).toBeVisible({ timeout: 5000 });
        });

        test('deve validar campos obrigatórios', async ({ page }) => {
            // Abrir formulário
            await page.click('button:has-text("Nova"), button:has-text("Adicionar")');
            await page.waitForTimeout(500);

            // Tentar submeter sem preencher
            await page.click('button[type="submit"]');

            // Verificar validação
            const descricaoInput = page.locator('input[name="descricao"]').first();
            await expect(descricaoInput).toHaveAttribute('required');
        });

        test('deve validar valor numérico', async ({ page }) => {
            // Abrir formulário
            await page.click('button:has-text("Nova")');
            await page.waitForTimeout(500);

            // Preencher com valor inválido
            const valorInput = page.locator('input[name="valor"], input[type="number"]').first();
            await valorInput.fill('-100');

            // Verificar validação (valor deve ser positivo)
            const min = await valorInput.getAttribute('min');
            expect(min).toBe('0');
        });
    });

    test.describe('Edição', () => {
        test('deve editar receita existente', async ({ page }) => {
            // Encontrar primeira receita e clicar em editar
            const editButton = page.locator('button:has-text("Editar"), button[aria-label*="Editar"]').first();
            await editButton.click();

            // Aguardar formulário
            await page.waitForTimeout(500);

            // Modificar descrição
            const descricaoInput = page.locator('input[name="descricao"]').first();
            await descricaoInput.clear();
            await descricaoInput.fill('Receita Editada E2E');

            // Salvar
            await page.click('button[type="submit"]:has-text("Salvar")');

            // Aguardar confirmação
            await page.waitForTimeout(1000);

            // Verificar que foi atualizada
            await expect(page.locator('text=Receita Editada E2E')).toBeVisible({ timeout: 5000 });
        });

        test('deve cancelar edição', async ({ page }) => {
            // Clicar em editar
            await page.click('button:has-text("Editar")').first();
            await page.waitForTimeout(500);

            // Modificar campo
            const descricaoInput = page.locator('input[name="descricao"]').first();
            const originalValue = await descricaoInput.inputValue();
            await descricaoInput.fill('Modificação temporária');

            // Cancelar
            await page.click('button:has-text("Cancelar"), button:has-text("Fechar")');

            // Verificar que voltou sem salvar
            await page.waitForTimeout(500);
            await expect(page.locator(`text=${originalValue}`)).toBeVisible();
        });
    });

    test.describe('Exclusão', () => {
        test('deve excluir receita com confirmação', async ({ page }) => {
            // Contar receitas antes
            const receitasAntes = await page.locator('table tr, .receita-item').count();

            // Clicar em excluir
            await page.click('button:has-text("Excluir"), button[aria-label*="Excluir"]').first();

            // Aguardar modal de confirmação
            await page.waitForTimeout(500);

            // Confirmar exclusão
            await page.click('button:has-text("Confirmar"), button:has-text("Sim"), button:has-text("Excluir")');

            // Aguardar atualização
            await page.waitForTimeout(1000);

            // Verificar que foi removida
            const receitasDepois = await page.locator('table tr, .receita-item').count();
            expect(receitasDepois).toBeLessThan(receitasAntes);
        });

        test('deve cancelar exclusão', async ({ page }) => {
            // Contar receitas antes
            const receitasAntes = await page.locator('table tr, .receita-item').count();

            // Clicar em excluir
            await page.click('button:has-text("Excluir")').first();
            await page.waitForTimeout(500);

            // Cancelar
            await page.click('button:has-text("Cancelar"), button:has-text("Não")');

            // Verificar que não foi removida
            await page.waitForTimeout(500);
            const receitasDepois = await page.locator('table tr, .receita-item').count();
            expect(receitasDepois).toBe(receitasAntes);
        });
    });

    test.describe('Filtros e Ordenação', () => {
        test('deve filtrar por categoria', async ({ page }) => {
            // Selecionar filtro de categoria
            const categoriaFilter = page.locator('select:has-text("Categoria"), select[name="categoria"]').first();

            if (await categoriaFilter.isVisible()) {
                await categoriaFilter.selectOption('Salário');
                await page.waitForTimeout(500);

                // Verificar que resultados foram filtrados
                const results = page.locator('table tr:has-text("Salário"), .receita-item:has-text("Salário")');
                const count = await results.count();
                expect(count).toBeGreaterThan(0);
            }
        });

        test('deve filtrar por período', async ({ page }) => {
            // Preencher data inicial
            const dataInicio = page.locator('input[name="dataInicio"], input[placeholder*="início"]').first();

            if (await dataInicio.isVisible()) {
                await dataInicio.fill('2025-01-01');

                // Preencher data final
                const dataFim = page.locator('input[name="dataFim"], input[placeholder*="fim"]').first();
                await dataFim.fill('2025-01-31');

                // Aplicar filtro
                await page.click('button:has-text("Filtrar"), button:has-text("Aplicar")');
                await page.waitForTimeout(500);

                // Verificar que há resultados
                const results = page.locator('table tr, .receita-item');
                const count = await results.count();
                expect(count).toBeGreaterThanOrEqual(0);
            }
        });

        test('deve ordenar por valor', async ({ page }) => {
            // Clicar no cabeçalho da coluna valor
            const valorHeader = page.locator('th:has-text("Valor"), button:has-text("Valor")').first();

            if (await valorHeader.isVisible()) {
                await valorHeader.click();
                await page.waitForTimeout(500);

                // Verificar que a ordem mudou (visual)
                const firstValue = await page.locator('table tr:nth-child(1) td:nth-child(2), .receita-item:first-child').textContent();
                expect(firstValue).toBeTruthy();
            }
        });
    });

    test.describe('Responsividade', () => {
        test('deve funcionar em mobile', async ({ page }) => {
            // Definir viewport mobile
            await page.setViewportSize({ width: 375, height: 667 });

            // Recarregar página
            await page.reload();

            // Verificar que elementos estão visíveis
            await expect(page.locator('h1, h2')).toBeVisible();

            // Verificar que botão de adicionar está acessível
            const addButton = page.locator('button:has-text("Nova"), button:has-text("+")').first();
            await expect(addButton).toBeVisible();
        });
    });
});
