import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },

    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
    },
  },

  eslintPluginPrettierRecommended,
];
