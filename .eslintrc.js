module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  env: {
    node: true,
    'jest/globals': true,
  },
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': ['error'],
  },
  parser: '@babel/eslint-parser',
};
