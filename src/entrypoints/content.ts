import { tabWidthStore } from '@/lib/tab-width-store';

export default defineContentScript({
	matches: ['*://github.com/*'],
	runAt: 'document_idle',
	async main(ctx) {
		function applyTabWidth(width: number) {
			let style = document.getElementById('web-editorconfig-tabwidth');
			if (!style) {
				style = document.createElement('style');
				style.id = 'web-editorconfig-tabwidth';
				document.head.appendChild(style);
			}
			style.textContent = `
        .blob-code, .highlight pre, .markdown-body pre,
        .react-code-lines, .react-blob-print-hide,
        .CodeMirror pre, .cm-content, [class*="code-"] pre {
          tab-size: ${width} !important;
          -moz-tab-size: ${width} !important;
        }
      `;
		}

		// Apply saved value on load
		const savedWidth = await tabWidthStore.getValue();
		applyTabWidth(savedWidth);

		// Watch for storage changes (from popup or other contexts)
		tabWidthStore.watch((newValue) => {
			applyTabWidth(newValue ?? tabWidthStore.fallback);
		});

		// Re-apply on GitHub SPA navigation (Turbo/PJAX)
		ctx.addEventListener(document, 'turbo:load', async () => {
			const width = await tabWidthStore.getValue();
			applyTabWidth(width);
		});

		// Also handle older pjax events (fallback)
		ctx.addEventListener(document, 'pjax:end', async () => {
			const width = await tabWidthStore.getValue();
			applyTabWidth(width);
		});

		// Listen for direct messages from popup (immediate update)
		browser.runtime.onMessage.addListener((message: { type: string; value: number }) => {
			if (message.type === 'updateTabWidth') {
				applyTabWidth(message.value);
			}
		});
	}
});
