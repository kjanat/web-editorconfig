import { tabWidthStore } from '@/utils/tab-width-store';

export default defineContentScript({
	matches: ['*://raw.githubusercontent.com/*'],
	runAt: 'document_idle',
	async main() {
		function applyTabWidth(width: number) {
			let style = document.getElementById('web-editorconfig-tabwidth');
			if (!style) {
				style = document.createElement('style');
				style.id = 'web-editorconfig-tabwidth';
				document.head.appendChild(style);
			}
			style.textContent = `
				body > pre {
					tab-size: ${width} !important;
					-moz-tab-size: ${width} !important;
				}
			`;
		}

		// Apply saved value on load
		const savedWidth = await tabWidthStore.getValue();
		applyTabWidth(savedWidth);

		// Watch for storage changes (from popup)
		tabWidthStore.watch((newValue) => {
			applyTabWidth(newValue);
		});

		// Listen for direct messages from popup (immediate update)
		browser.runtime.onMessage.addListener((message: { type: string; value: number }) => {
			if (message.type === 'updateTabWidth') {
				applyTabWidth(message.value);
			}
		});
	}
});
