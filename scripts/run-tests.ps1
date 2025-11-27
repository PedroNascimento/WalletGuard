# Script para executar testes de forma controlada
# Evita travamentos e fornece feedback detalhado

Write-Host "🧪 Executando testes do WalletGuard" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Função para executar com timeout
function Run-TestWithTimeout {
    param(
        [string]$TestPattern,
        [string]$Description,
        [int]$TimeoutSeconds = 60
    )
    
    Write-Host "📝 $Description..." -ForegroundColor Yellow
    
    $job = Start-Job -ScriptBlock {
        param($pattern)
        Set-Location $using:PWD
        if ($pattern) {
            npm test -- --run --reporter=verbose --testNamePattern="$pattern"
        }
        else {
            npm test -- --run --reporter=verbose
        }
    } -ArgumentList $TestPattern
    
    $completed = Wait-Job $job -Timeout $TimeoutSeconds
    
    if ($completed) {
        $output = Receive-Job $job
        Remove-Job $job
        Write-Host "✅ Concluído" -ForegroundColor Green
        return $true
    }
    else {
        Stop-Job $job
        Remove-Job $job
        Write-Host "⏱️ Timeout após $TimeoutSeconds segundos" -ForegroundColor Red
        return $false
    }
}

# Executar testes por categoria
Write-Host "1️⃣ Testando cálculos financeiros..." -ForegroundColor Cyan
npm test -- --run src/utils/financial.test.ts

Write-Host ""
Write-Host "2️⃣ Testando serviços..." -ForegroundColor Cyan
npm test -- --run "src/services/*.test.ts"

Write-Host ""
Write-Host "3️⃣ Testando contextos..." -ForegroundColor Cyan
npm test -- --run "src/context/*.test.tsx"

Write-Host ""
Write-Host "4️⃣ Testando componentes UI..." -ForegroundColor Cyan
npm test -- --run "src/components/ui/*.test.tsx"

Write-Host ""
Write-Host "5️⃣ Testando formulários..." -ForegroundColor Cyan
npm test -- --run "src/components/**/Form.test.tsx"

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Testes concluídos!" -ForegroundColor Green
