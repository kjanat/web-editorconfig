import { defineConfig } from 'wxt';
const source = 'src';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: source,
	autoIcons: {
		baseIconPath: 'assets/icon.svg',
		developmentIndicator: 'overlay',
		enabled: true
	},
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'Web EditorConfig',
		description: 'Customize tab-width rendering on GitHub',
		permissions: ['storage'],
		browser_specific_settings: {
			gecko: {
				id: 'web-editorconfig@kjanat.com',
				data_collection_permissions: {
					required: ['none']
				}
			} as { id: string; data_collection_permissions: { required: string[] } }
		}
	},
	zip: {
		// Exclude from extension ZIP
		exclude: ['**/_*', '**/*.pem'],
		// Exclude from sources ZIP (Firefox review)
		excludeSources: ['**/_*', '**/*.pem', '**/screenshots/**']
	},
	vite: (env) => ({
		build: {
			// Disable minification for Firefox (required for Mozilla Add-ons review)
			minify: env.browser === 'firefox' ? false : undefined,
			cssMinify: env.browser === 'firefox' ? false : undefined
		}
	})
	// webExt: {
	// 	keepProfileChanges: true,
	// 	binaries: {
	// 		// chrome: 'google-chrome-stable',
	// 		// chromium: 'chromium',
	// 		edge: 'microsoft-edge-stable'
	// 		// firefox: 'firefox'
	// 	}
	// 	// chromiumArgs: ['--user-data-dir=./.wxt/chrome-data']
	// }

	// Optional: Pass options to the module:
	// svelte: { vite: {} }
});
