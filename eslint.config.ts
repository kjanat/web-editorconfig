import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config';
import autoImports from './.wxt/eslint-auto-imports.mjs';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	autoImports,
	js.configs.recommended,
	// Strictest TypeScript rules with type-checking
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	// Strictest Svelte rules
	...svelte.configs['flat/all'],
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: {
					allowDefaultProject: ['.prettierrc.ts']
				}
			}
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Allow lang="ts" in script blocks (required for TypeScript)
			'svelte/block-lang': ['error', { script: 'ts', style: null }],
			// CSS classes are fine, don't force IDs everywhere
			'svelte/consistent-selector-style': 'off'
		}
	},
	{
		// Content scripts run outside Svelte context - addEventListener is appropriate
		files: ['**/entrypoints/*.ts'],
		rules: {
			'svelte/no-add-event-listener': 'off'
		}
	}
);
