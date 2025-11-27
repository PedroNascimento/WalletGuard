import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        testTimeout: 10000, // 10 seconds timeout per test
        hookTimeout: 10000, // 10 seconds timeout for hooks
        teardownTimeout: 10000,
        isolate: true,
        pool: 'forks', // Use forks instead of threads for better isolation
        poolOptions: {
            forks: {
                singleFork: false,
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov', 'json'],
            reportsDirectory: './reports/coverage',
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                'dist/',
                '.eslintrc.cjs',
            ],
            include: [
                'src/services/**/*.ts',
                'src/utils/**/*.ts',
                'src/components/**/*.tsx',
            ],
            all: true,
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
