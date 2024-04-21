// @ts-check

import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: ['./bin/*']
  },
  {
    files: [
      '.eslintrc.{js,cjs}'
    ],
    parserOptions: {
      sourceType: 'script'
    }
    ,
  },
  {
    files: ['test/**/*'],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      indent: [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      quotes: [
        'error',
        'single'
      ],
      semi: [
        'error',
        'always'
      ],
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_'
      }]
    }
  }];
