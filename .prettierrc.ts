import '@prettier/plugin-xml';
import type { Config as PrettierConfig } from 'prettier';
import 'prettier-plugin-packagejson';
import type {
	PluginConfig as SvelteConfig,
	SortOrder as SvelteSortOrder
} from 'prettier-plugin-svelte';

type ConfigType = PrettierConfig & SvelteConfig;

const svelteConfig = {
	svelteSortOrder: 'options-scripts-markup-styles' as const satisfies SvelteSortOrder,
	svelteStrictMode: true,
	svelteAllowShorthand: true,
	svelteIndentScriptAndStyle: true
} as const satisfies Partial<SvelteConfig>;

const config: ConfigType = {
	...svelteConfig,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [
		'@awmottaz/prettier-plugin-void-html',
		'@prettier/plugin-xml',
		'prettier-plugin-packagejson',
		'prettier-plugin-svelte'
	],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		},
		{
			files: '*.svg',
			options: {
				useTabs: true,
				parser: 'xml',
				printWidth: 100
			}
		}
	]
};

export default config;
