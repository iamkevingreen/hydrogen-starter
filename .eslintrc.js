module.exports = {
  extends: ['plugin:hydrogen/recommended'],
  rules: {
    'node/no-missing-import': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    singleQuote: true,
    semi: [1, 'never']
  },
};
