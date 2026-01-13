export default defineContentScript({
  matches: ['*://github.com/*'],
  runAt: 'document_idle',
  async main(ctx) {
    const tabWidthItem = storage.defineItem<number>('local:tabWidth', {
      fallback: 4,
    });

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
    const savedWidth = await tabWidthItem.getValue();
    applyTabWidth(savedWidth);

    // Re-apply on GitHub SPA navigation (Turbo/PJAX)
    ctx.addEventListener(document, 'turbo:load', async () => {
      const width = await tabWidthItem.getValue();
      applyTabWidth(width);
    });

    // Also handle older pjax events (fallback)
    ctx.addEventListener(document, 'pjax:end', async () => {
      const width = await tabWidthItem.getValue();
      applyTabWidth(width);
    });

    // Listen for updates from popup
    browser.runtime.onMessage.addListener((message: { type: string; value: number }) => {
      if (message.type === 'updateTabWidth') {
        applyTabWidth(message.value);
      }
    });
  },
});
