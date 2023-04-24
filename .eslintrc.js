module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  env: { browser: true, esNext: true },
  plugins: ['simple-import-sort', 'import'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
