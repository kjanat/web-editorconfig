import { defineConfig, type UserManifest } from 'wxt';

const GITHUB_REPOSITORY = 'kjanat/web-editorconfig';
const CHROME_WEB_STORE_ID = 'babmcedjjlfbkpffmpkhgkokgamaecgh';

type firefoxSettings = UserManifest['browser_specific_settings']['gecko']
	// = {	id: '' }

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	imports: {
		eslintrc: {
			enabled: 9
		}
	},
	webExt: {
		chromiumPref: {
			devtools: {
				synced_preferences_sync_disabled: {
					skipContentScripts: false
				}
			},
			extensions: {
				ui: {
					developer_mode: true
				}
			}
		},
		chromiumArgs: [],
		firefoxArgs: [
			`--start-url ${GITHUB_REPOSITORY}`,
			`--arg='--new-tab=chrome://extensions/?id=${CHROME_WEB_STORE_ID}'`
		],
		firefoxPrefs: {}
	},
	autoIcons: {
		baseIconPath: 'assets/icon.svg',
		developmentIndicator: 'overlay',
		sizes: [512, 256, 128, 64, 32, 16]
	},
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'Web EditorConfig',
		description: 'Customize tab-width rendering on GitHub',
		permissions: ['storage'],
		browser_specific_settings: {
			gecko: {
				id: 'web-editorconfig@kjanat.com',
				/*data_collection_permissions: {
					required: [],
					optional: []
				} as unknown*/
			} as UserManifest['browser_specific_settings']['gecko'] /*& {
				data_collection_permissions: { required: string[]; optional: string[] };
			}*/
		}
	},
	zip: {
		artifactTemplate: '{{name}}-{{version}}-{{browser}}-{{manifestVersion}}-{{mode}}.zip',
		sourcesTemplate: '{{name}}-{{version}}-{{browser}}-{{manifestVersion}}-{{mode}}-sources.zip',
		// Exclude from extension ZIP
		exclude: ['**/_*', '**/*.pem'],
		// Exclude from sources ZIP (Firefox review)
		excludeSources: ['**/_*', '**/*.pem', '**/screenshots/**'],
		// Set maximum compression level
		compressionLevel: 9
	},
	analysis: {
		enabled: true,
		open: false,
		template: 'treemap' // "sunburst" | "treemap" | "network" | "raw-data" | "list" | "flamegraph";
	}

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
