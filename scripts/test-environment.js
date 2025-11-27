import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas no .env.test');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

// Credenciais de teste
const TEST_USER = {
    email: 'test1@example.com',
    password: 'password123'
};

let testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, message = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}${message ? ': ' + message : ''}`);
    testResults.tests.push({ name, passed, message });
    if (passed) testResults.passed++;
    else testResults.failed++;
}

async function runTests() {
    console.log('\n🧪 Iniciando testes do ambiente...\n');
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Teste de Autenticação
    console.log('📝 TESTE 1: Autenticação');
    console.log('───────────────────────────────────────────────────────');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: TEST_USER.email,
        password: TEST_USER.password
    });

    if (authError) {
        logTest('Login com usuário de teste', false, authError.message);
        console.log('\n❌ Falha crítica na autenticação. Abortando testes.\n');
        return;
    }

    logTest('Login com usuário de teste', true, `User ID: ${authData.user.id}`);
    const userId = authData.user.id;

    // 2. Teste de Receitas
    console.log('\n📝 TESTE 2: CRUD de Receitas');
    console.log('───────────────────────────────────────────────────────');

    // Listar receitas
    const { data: receitas, error: receitasError } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', userId);

    logTest('Listar receitas', !receitasError,
        receitasError ? receitasError.message : `${receitas?.length || 0} receita(s) encontrada(s)`);

    // Criar receita
    const { data: novaReceita, error: createReceitaError } = await supabase
        .from('receitas')
        .insert({
            user_id: userId,
            description: 'Teste Automatizado',
            value: 500,
            date: new Date().toISOString().split('T')[0],
            category: 'Freelance'
        })
        .select()
        .single();

    logTest('Criar receita', !createReceitaError,
        createReceitaError ? createReceitaError.message : `ID: ${novaReceita?.id}`);

    // Atualizar receita
    if (novaReceita) {
        const { error: updateReceitaError } = await supabase
            .from('receitas')
            .update({ value: 600 })
            .eq('id', novaReceita.id);

        logTest('Atualizar receita', !updateReceitaError,
            updateReceitaError ? updateReceitaError.message : 'Valor atualizado para R$ 600');

        // Deletar receita
        const { error: deleteReceitaError } = await supabase
            .from('receitas')
            .delete()
            .eq('id', novaReceita.id);

        logTest('Deletar receita', !deleteReceitaError,
            deleteReceitaError ? deleteReceitaError.message : 'Receita removida');
    }

    // 3. Teste de Despesas
    console.log('\n📝 TESTE 3: CRUD de Despesas');
    console.log('───────────────────────────────────────────────────────');

    const { data: despesas, error: despesasError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

    logTest('Listar despesas', !despesasError,
        despesasError ? despesasError.message : `${despesas?.length || 0} despesa(s) encontrada(s)`);

    const { data: novaDespesa, error: createDespesaError } = await supabase
        .from('expenses')
        .insert({
            user_id: userId,
            description: 'Teste Automatizado',
            value: 200,
            date: new Date().toISOString().split('T')[0],
            category: 'Alimentação'
        })
        .select()
        .single();

    logTest('Criar despesa', !createDespesaError,
        createDespesaError ? createDespesaError.message : `ID: ${novaDespesa?.id}`);

    if (novaDespesa) {
        const { error: deleteDespesaError } = await supabase
            .from('expenses')
            .delete()
            .eq('id', novaDespesa.id);

        logTest('Deletar despesa', !deleteDespesaError,
            deleteDespesaError ? deleteDespesaError.message : 'Despesa removida');
    }

    // 4. Teste de Cartões
    console.log('\n📝 TESTE 4: CRUD de Cartões');
    console.log('───────────────────────────────────────────────────────');

    const { data: cartoes, error: cartoesError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId);

    logTest('Listar cartões', !cartoesError,
        cartoesError ? cartoesError.message : `${cartoes?.length || 0} cartão(ões) encontrado(s)`);

    const { data: novoCartao, error: createCartaoError } = await supabase
        .from('credit_cards')
        .insert({
            user_id: userId,
            name: 'Cartão Teste Auto',
            brand: 'Mastercard',
            limit_amount: 3000,
            closing_day: 15,
            due_day: 20,
            color: '#FF0000'
        })
        .select()
        .single();

    logTest('Criar cartão', !createCartaoError,
        createCartaoError ? createCartaoError.message : `ID: ${novoCartao?.id}`);

    if (novoCartao) {
        const { error: deleteCartaoError } = await supabase
            .from('credit_cards')
            .delete()
            .eq('id', novoCartao.id);

        logTest('Deletar cartão', !deleteCartaoError,
            deleteCartaoError ? deleteCartaoError.message : 'Cartão removido');
    }

    // 5. Teste de RLS (Row Level Security)
    console.log('\n📝 TESTE 5: Row Level Security (RLS)');
    console.log('───────────────────────────────────────────────────────');

    // Tentar acessar dados de outro usuário (deve falhar)
    const { data: outrasReceitas } = await supabase
        .from('receitas')
        .select('*')
        .neq('user_id', userId);

    logTest('RLS bloqueia acesso a dados de outros usuários',
        outrasReceitas?.length === 0,
        outrasReceitas?.length === 0 ? 'Nenhum dado de outro usuário acessível' : '⚠️ RLS pode estar desabilitado!');

    // 6. Teste de Bancos
    console.log('\n📝 TESTE 6: CRUD de Bancos');
    console.log('───────────────────────────────────────────────────────');

    const { data: novoBanco, error: createBancoError } = await supabase
        .from('bank_accounts')
        .insert({
            user_id: userId,
            name: 'Banco Teste',
            type: 'corrente',
            balance: 1000,
            color: '#00FF00'
        })
        .select()
        .single();

    logTest('Criar banco', !createBancoError,
        createBancoError ? createBancoError.message : `ID: ${novoBanco?.id}`);

    if (novoBanco) {
        const { error: deleteBancoError } = await supabase
            .from('bank_accounts')
            .delete()
            .eq('id', novoBanco.id);

        logTest('Deletar banco', !deleteBancoError,
            deleteBancoError ? deleteBancoError.message : 'Banco removido');
    }

    // Logout
    await supabase.auth.signOut();
    logTest('Logout', true, 'Sessão encerrada');

    // Resumo
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 RESUMO DOS TESTES');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`✅ Testes aprovados: ${testResults.passed}`);
    console.log(`❌ Testes falhados: ${testResults.failed}`);
    console.log(`📝 Total de testes: ${testResults.tests.length}`);

    const successRate = ((testResults.passed / testResults.tests.length) * 100).toFixed(1);
    console.log(`\n🎯 Taxa de sucesso: ${successRate}%\n`);

    if (testResults.failed === 0) {
        console.log('🎉 Todos os testes passaram! Ambiente configurado corretamente.\n');
    } else {
        console.log('⚠️ Alguns testes falharam. Revise a configuração do ambiente.\n');
        process.exit(1);
    }
}

runTests().catch(error => {
    console.error('\n❌ Erro ao executar testes:', error);
    process.exit(1);
});
