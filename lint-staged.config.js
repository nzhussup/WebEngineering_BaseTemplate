export default {
  'apps/**/*.{js,jsx,ts,tsx}': ['eslint --max-warnings 0', 'prettier --check'],
  'apps/**/*.{json,yaml,yml}': 'prettier --check',
};
