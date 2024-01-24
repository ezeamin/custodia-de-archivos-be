module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': 'off',
    camelcase: 'off',
    'no-restricted-globals': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-unused-vars': 'warn',
  },
  ignorePatterns: ['node_modules', 'dist', 'config'],
};
