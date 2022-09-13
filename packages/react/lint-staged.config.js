module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.{js,jsx,ts,tsx}': () => 'tsc -p tsconfig.json --noEmit',
};
