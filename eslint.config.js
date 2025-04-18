module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        process: 'readonly',
        module: 'writable',
        console: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': 'warn',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    },
    env: {
      node: true,
      es6: true,
      jest: true
    }
  }
]; 