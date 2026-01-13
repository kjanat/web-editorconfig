import { tabWidthStore } from './tab-width-store';

class TabWidthState {
  value = $state(tabWidthStore.fallback);

  constructor() {
    tabWidthStore.getValue().then(this.update);
    tabWidthStore.watch(this.update);
  }

  update = (newValue: number | null) => {
    this.value = newValue ?? tabWidthStore.fallback;
  };

  async save(value: number) {
    await tabWidthStore.setValue(value);
    // Notify content script immediately (storage.watch has slight delay)
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      browser.tabs.sendMessage(tabs[0].id, { type: 'updateTabWidth', value }).catch(() => {
        // Content script not available (non-GitHub tab) - storage.watch handles update
      });
    }
  }
}

export const tabWidthState = new TabWidthState();
