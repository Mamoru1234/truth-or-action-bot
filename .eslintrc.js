module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-console': 'error',
    'quotes': ['error', 'single'],
    'max-len': ['error', { 'code': 128, tabWidth: 2 }],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always']
  },
};
