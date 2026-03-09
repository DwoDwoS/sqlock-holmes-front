import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'coverage'],
    passWithNoTests: false,
    pool: 'threads',
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: 'coverage',
      all: false,
      statements: 80,
      branches: 70,
      functions: 75,
      lines: 80,
      exclude: [
          'src/main.tsx',
          'src/main.ts',
          'src/**/*.d.ts',
          'tests/**',
          '**/*.css',
          'src/assets/**',
          'public/**'
      ]
    } as Partial<{
      provider: 'v8';
      reporter: Array<'text' | 'lcov' | 'json' | 'html'>;
      reportsDirectory: string;
      all: boolean;
      statements: number;
      branches: number;
      functions: number;
      lines: number;
      exclude: string[];
    }>
  }
});