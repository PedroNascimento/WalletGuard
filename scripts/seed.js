import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar dotenv para ler .env.test
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || SERVICE_KEY.includes('sua-chave')) {
    console.error('Erro: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env.test');
    console.error('Certifique-se de configurar credenciais reais de teste antes de rodar o seed.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function seed() {
    console.log('Iniciando seed...');

    // 1. Criar Usuários
    const users = [
        { email: 'test1@example.com', password: 'password123', data: { full_name: 'Test User 1' } },
        { email: 'test2@example.com', password: 'password123', data: { full_name: 'Test User 2' } }
    ];

    const userIds = [];

    for (const u of users) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: u.data
        });

        if (error) {
            console.log(`Usuário ${u.email} já existe ou erro:`, error.message);
        } else {
            console.log(`Usuário criado: ${u.email} (${data.user.id})`);
            userIds.push(data.user.id);
        }
    }

    // Se não criou ninguém (já existiam), buscar IDs
    if (userIds.length === 0) {
        const { data: { users: allUsers }, error } = await supabase.auth.admin.listUsers();
        if (!error && allUsers) {
            const targetEmails = users.map(u => u.email);
            const found = allUsers.filter(u => targetEmails.includes(u.email));
            found.forEach(u => userIds.push(u.id));
        }
    }

    if (userIds.length === 0) {
        console.error('Nenhum usuário disponível para seed.');
        return;
    }

    // 2. Inserir Dados para cada usuário
    for (const userId of userIds) {
        console.log(`Inserindo dados para usuário ${userId}...`);

        // Cartão
        const { data: card, error: cardError } = await supabase.from('cards').insert({
            user_id: userId,
            name: 'Cartão Teste',
            brand: 'Visa',
            limit_amount: 5000,
            closing_day: 10,
            due_day: 15,
            color: '#000000'
        }).select().single();

        if (cardError) console.error('Erro ao criar cartão:', cardError.message);
        else console.log('Cartão criado.');

        // Receita
        const { error: recError } = await supabase.from('receitas').insert({
            user_id: userId,
            description: 'Salário Teste',
            value: 3000,
            date: new Date().toISOString().split('T')[0],
            category: 'Salário',
            type: 'fixa'
        });
        if (recError) console.error('Erro receita:', recError.message);
        else console.log('Receita criada.');

        // Despesa
        const { error: expError } = await supabase.from('expenses').insert({
            user_id: userId,
            description: 'Aluguel Teste',
            value: 1000,
            date: new Date().toISOString().split('T')[0],
            category: 'Moradia',
            type: 'fixa'
        });
        if (expError) console.error('Erro despesa:', expError.message);
        else console.log('Despesa criada.');
    }

    console.log('Seed concluído!');
}

seed();
