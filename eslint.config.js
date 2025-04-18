module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        // Globals para Node.js
        require: 'readonly',
        process: 'readonly',
        module: 'writable',
        console: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
        // Globals para Jest
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        // Outros globals para ES6
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': 'warn',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  }
]; 