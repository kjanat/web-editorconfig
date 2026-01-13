import { defineConfig } from 'wxt';
const source = 'src';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: source,
	autoIcons: {
		baseIconPath: 'assets/icon.svg',
		developmentIndicator: 'overlay',
		enabled: true,
		sizes: [256, 128, 96, 48, 32, 16]
	},
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'Web EditorConfig',
		description: 'Customize tab-width rendering on GitHub',
		permissions: ['storage']
	}

	// Optional: Pass options to the module:
	// svelte: { vite: {} }
});
