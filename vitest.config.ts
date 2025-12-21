/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__tests__/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/__tests__/',
                '**/*.d.ts',
                'src/components/ui/', // shadcn components - third party
            ],
            // Coverage thresholds - CI will fail if below these
            // Current coverage: ~27%, set threshold at 20% with room to increase
            thresholds: {
                statements: 20,
                branches: 15,
                functions: 15,
                lines: 20,
            },
        },
    },
});
