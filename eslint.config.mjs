// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const config = tseslint.config(
  {
    ignores: ['*.config.*{ts,js}'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          internalPattern: ['^@/.+'],
          groups: [
            'value-builtin',
            'type-builtin',

            'value-external',
            'type-external',

            'value-internal',
            'type-internal',

            'value-parent',
            'type-parent',

            'value-sibling',
            'type-sibling',

            'value-index',
            'type-index',

            ['value-side-effect-style', 'value-style', 'import', 'unknown'],
          ],
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);

export default config;
