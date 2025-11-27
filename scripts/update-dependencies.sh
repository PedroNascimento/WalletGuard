#!/bin/bash
# Script de Atualização Segura de Dependências
# WalletGuard - Security Update PR #6

echo "🔒 WalletGuard - Atualização de Dependências"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar sucesso
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 falhou!${NC}"
        exit 1
    fi
}

# 1. Backup
echo "📦 Criando backup..."
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup
check_success "Backup criado"

# 2. Atualizar dependências de produção
echo ""
echo "🔄 Atualizando dependências de produção..."

echo "  → @supabase/supabase-js: 2.84.0 → 2.86.0"
npm install @supabase/supabase-js@2.86.0
check_success "@supabase/supabase-js atualizado"

echo "  → recharts: 3.4.1 → 3.5.0"
npm install recharts@3.5.0
check_success "recharts atualizado"

# 3. Atualizar dependências de desenvolvimento
echo ""
echo "🔧 Atualizando dependências de desenvolvimento..."

echo "  → typescript-eslint: 8.47.0 → 8.48.0"
npm install --save-dev typescript-eslint@8.48.0
check_success "typescript-eslint atualizado"

echo "  → vite-plugin-pwa: 1.1.0 → 1.2.0"
npm install --save-dev vite-plugin-pwa@1.2.0
check_success "vite-plugin-pwa atualizado"

echo "  → @types/react: 19.2.6 → 19.2.7"
npm install --save-dev @types/react@19.2.7
check_success "@types/react atualizado"

# 4. Executar testes
echo ""
echo "🧪 Executando testes..."

echo "  → Testes unitários..."
npm test -- --run
check_success "Testes unitários"

echo "  → Linting..."
npm run lint
check_success "Linting"

echo "  → Build..."
npm run build
check_success "Build"

# 5. Resumo
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Atualização concluída com sucesso!${NC}"
echo "=============================================="
echo ""
echo "📊 Resumo das atualizações:"
echo "  • @supabase/supabase-js: 2.84.0 → 2.86.0"
echo "  • recharts: 3.4.1 → 3.5.0"
echo "  • typescript-eslint: 8.47.0 → 8.48.0"
echo "  • vite-plugin-pwa: 1.1.0 → 1.2.0"
echo "  • @types/react: 19.2.6 → 19.2.7"
echo ""
echo "📝 Próximos passos:"
echo "  1. Revisar mudanças: git diff package.json"
echo "  2. Testar aplicação: npm run dev"
echo "  3. Criar commit: git commit -am 'chore: update dependencies'"
echo "  4. Criar PR: gh pr create"
echo ""
