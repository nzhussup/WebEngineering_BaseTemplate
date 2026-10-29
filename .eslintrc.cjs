module.exports = {
  root: true,
  env: { es2022: true },
  extends: [
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    project: ['./apps/web/tsconfig.eslint.json', './apps/api/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/dist/', 'node_modules/'],
  overrides: [
    {
      files: ['apps/web/src/**/*.{js,jsx,ts,tsx}'],
      env: { browser: true },
    },
    {
      files: ['apps/api/src/**/*.ts'],
      env: { node: true },
    },
  ],
};
