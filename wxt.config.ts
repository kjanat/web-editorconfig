import { defineConfig } from 'wxt';
const source = 'src';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: source,
	autoIcons: {
		baseIconPath: 'assets/icon.svg',
		developmentIndicator: 'grayscale', // 'overlay',
		enabled: true,
		sizes: [128, 48, 32, 16]
	},
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'Web EditorConfig',
		description: 'Customize tab-width rendering on GitHub',
		permissions: ['storage']
	},
	webExt: {
		keepProfileChanges: true,
		binaries: {
			// chrome: 'google-chrome-stable',
			// chromium: 'chromium',
			edge: 'microsoft-edge-stable'
			// firefox: 'firefox'
		}
		// chromiumArgs: ['--user-data-dir=./.wxt/chrome-data']
	}

	// Optional: Pass options to the module:
	// svelte: { vite: {} }
});
