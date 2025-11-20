import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres.clazqfvwgtexmqtpspuk:OHtKb9Jo0Eql2WFXd85qo1mm@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const sqlPath = path.join(__dirname, '../supabase/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing schema...');
        await client.query(sql);
        console.log('Schema executed successfully');

    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await client.end();
    }
}

run();
