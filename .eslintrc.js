module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-console': 'error',
    quotes: ['error', 'single'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
  },
};
