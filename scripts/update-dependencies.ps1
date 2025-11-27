# Script de Atualização Segura de Dependências
# WalletGuard - Security Update PR #6
# PowerShell Version

Write-Host "🔒 WalletGuard - Atualização de Dependências" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

function Check-Success {
    param($Message)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message falhou!" -ForegroundColor Red
        exit 1
    }
}

# 1. Backup
Write-Host "📦 Criando backup..." -ForegroundColor Yellow
Copy-Item package.json package.json.backup
Copy-Item package-lock.json package-lock.json.backup
Check-Success "Backup criado"

# 2. Atualizar dependências de produção
Write-Host ""
Write-Host "🔄 Atualizando dependências de produção..." -ForegroundColor Yellow

Write-Host "  → @supabase/supabase-js: 2.84.0 → 2.86.0"
npm install @supabase/supabase-js@2.86.0
Check-Success "@supabase/supabase-js atualizado"

Write-Host "  → recharts: 3.4.1 → 3.5.0"
npm install recharts@3.5.0
Check-Success "recharts atualizado"

# 3. Atualizar dependências de desenvolvimento
Write-Host ""
Write-Host "🔧 Atualizando dependências de desenvolvimento..." -ForegroundColor Yellow

Write-Host "  → typescript-eslint: 8.47.0 → 8.48.0"
npm install --save-dev typescript-eslint@8.48.0
Check-Success "typescript-eslint atualizado"

Write-Host "  → vite-plugin-pwa: 1.1.0 → 1.2.0"
npm install --save-dev vite-plugin-pwa@1.2.0
Check-Success "vite-plugin-pwa atualizado"

Write-Host "  → @types/react: 19.2.6 → 19.2.7"
npm install --save-dev @types/react@19.2.7
Check-Success "@types/react atualizado"

# 4. Executar testes
Write-Host ""
Write-Host "🧪 Executando testes..." -ForegroundColor Yellow

Write-Host "  → Testes unitários..."
npm test -- --run
Check-Success "Testes unitários"

Write-Host "  → Linting..."
npm run lint
Check-Success "Linting"

Write-Host "  → Build..."
npm run build
Check-Success "Build"

# 5. Resumo
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Atualização concluída com sucesso!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Resumo das atualizações:" -ForegroundColor Cyan
Write-Host "  • @supabase/supabase-js: 2.84.0 → 2.86.0"
Write-Host "  • recharts: 3.4.1 → 3.5.0"
Write-Host "  • typescript-eslint: 8.47.0 → 8.48.0"
Write-Host "  • vite-plugin-pwa: 1.1.0 → 1.2.0"
Write-Host "  • @types/react: 19.2.6 → 19.2.7"
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Revisar mudanças: git diff package.json"
Write-Host "  2. Testar aplicação: npm run dev"
Write-Host "  3. Criar commit: git commit -am 'chore: update dependencies'"
Write-Host "  4. Criar PR no GitHub"
Write-Host ""
