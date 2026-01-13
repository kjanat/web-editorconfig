/** @type {import("prettier").Config} */
const prettierConfig = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		},
		{
			files: '*.svg',
			useTabs: true,
			tabWidth: 2,
			options: {
				parser: 'html'
			}
		}
	]
};

export default prettierConfig;
