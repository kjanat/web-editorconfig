export default defineContentScript({
  matches: ['*://github.com/*'],
  runAt: 'document_idle',
  async main() {
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

    // Listen for updates from popup
    browser.runtime.onMessage.addListener((message: { type: string; value: number }) => {
      if (message.type === 'updateTabWidth') {
        applyTabWidth(message.value);
      }
    });
  },
});
