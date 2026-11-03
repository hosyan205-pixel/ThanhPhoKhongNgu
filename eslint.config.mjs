import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.wrangler/**',
      '.tools/**',
      '**/coverage/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs}', '*.config.ts', 'tests/**/*.ts', 'apps/*/vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/*/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-restricted-imports': ['error', { patterns: ['**/workers/**', 'cloudflare:*', 'node:*'] }],
    },
  },
  {
    files: ['workers/*/src/**/*.ts'],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    files: ['packages/*/src/**/*.ts'],
    languageOptions: {
      globals: { Request: 'readonly', Response: 'readonly', Headers: 'readonly' },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['node:*', 'cloudflare:*', '**/workers/**', '**/apps/**'],
        },
      ],
    },
  },
  prettier,
);
