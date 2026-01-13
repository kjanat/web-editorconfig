import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Web EditorConfig',
    description: 'Customize tab-width rendering on GitHub',
    permissions: ['storage'],
  },
});
