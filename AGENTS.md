# AGENTS.md - AI Agent Guidelines for web-editorconfig

Browser extension for customizing tab-width rendering on GitHub (editorconfig-like for browsers).
Built with **WXT** (Vite-based extension framework) + **Svelte 5** + **TypeScript**.

---

## Project Overview

- **Framework**: WXT v0.20+ (https://wxt.dev)
- **UI**: Svelte 5 (runes-based reactivity)
- **Language**: TypeScript (strict mode)
- **Target**: Chrome, Firefox, Edge (WebExtensions API)
- **Package Manager**: bun (preferred), npm/pnpm compatible

### Directory Structure

```
src/
  entrypoints/       # Extension entry points (WXT convention)
    background.ts    # Service worker / background script
    content.ts       # Content scripts injected into pages
    popup/           # Browser action popup UI
      index.html
      main.ts
      App.svelte
      app.css
  lib/               # Shared Svelte components
  assets/            # Static assets (images, svgs)
public/              # Public assets copied to output
  icon/              # Extension icons (16, 32, 48, 96, 128 px)
.wxt/                # Generated WXT files (do not edit)
.output/             # Build output (gitignored)
```

---

## Build & Development Commands

```bash
# Development (Chrome)
bun run dev

# Development (Firefox)
bun run dev:firefox

# Production build
bun run build
bun run build:firefox

# Create distributable zip
bun run zip
bun run zip:firefox

# Type checking
bun run check           # svelte-check

# Prepare WXT (generates types)
bun run postinstall     # or: wxt prepare
```

### No Test Framework Configured

This project currently has no test runner. If adding tests:
- Consider `vitest` for unit tests
- Consider `@playwright/test` for E2E extension testing

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - no implicit any, strict null checks
- **Target**: ESNext with Bundler module resolution
- **Path aliases**: `@/` and `~/` map to `src/`, `@@/` and `~~/` map to project root

```typescript
// Preferred imports
import { something } from '@/lib/utils';
import Component from '~/lib/Component.svelte';
```

### Imports

1. External packages first
2. Internal absolute imports (`@/`, `~/`)
3. Relative imports last
4. Svelte components use `.svelte` extension

```typescript
// Example ordering
import { mount } from 'svelte';
import { storage } from 'wxt/storage';
import { someUtil } from '@/lib/utils';
import App from './App.svelte';
import './app.css';
```

### Svelte 5 Conventions

- Use **Svelte 5 runes** (`$state`, `$derived`, `$effect`) for reactivity
- Prefer `<script lang="ts">` for type safety
- Component files: PascalCase (`Counter.svelte`)
- CSS scoped by default in `<style>` blocks

```svelte
<script lang="ts">
  let count = $state(0);
  const doubled = $derived(count * 2);
</script>
```

### WXT Entrypoint Conventions

- **Content scripts**: Use `defineContentScript()` with `matches` pattern
- **Background**: Use `defineBackground()` for service worker
- **Popups/Options**: Standard HTML + Svelte mounting

```typescript
// content.ts
export default defineContentScript({
  matches: ['*://github.com/*'],
  main(ctx) {
    // Content script logic
  },
});

// background.ts
export default defineBackground(() => {
  // Background/service worker logic
});
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (TS) | camelCase | `tabWidth.ts` |
| Files (Svelte) | PascalCase | `Settings.svelte` |
| Variables | camelCase | `tabWidth` |
| Constants | UPPER_SNAKE | `DEFAULT_TAB_WIDTH` |
| Types/Interfaces | PascalCase | `TabConfig` |
| Functions | camelCase | `applyTabWidth()` |
| CSS classes | kebab-case | `.tab-config` |

### Error Handling

```typescript
// Use try-catch with typed errors
try {
  await browser.storage.local.get('config');
} catch (error) {
  console.error('[web-editorconfig]', error);
}

// Content scripts - guard against missing elements
const codeBlocks = document.querySelectorAll('pre code');
if (!codeBlocks.length) return;
```

### Browser API Usage

- Use `browser.*` API (WXT auto-polyfills for Chrome's `chrome.*`)
- Prefer `storage.local` for large data, `storage.sync` for user prefs
- WXT provides `wxt/storage` helper for typed storage

```typescript
import { storage } from 'wxt/storage';

// Define typed storage item
const tabWidth = storage.defineItem<number>('local:tabWidth', {
  fallback: 4,
});

// Usage
const width = await tabWidth.getValue();
await tabWidth.setValue(2);
```

---

## Extension-Specific Patterns

### Content Script for GitHub Tab Width

Target GitHub's code rendering elements:

```typescript
export default defineContentScript({
  matches: ['*://github.com/*'],
  runAt: 'document_idle',
  main() {
    // GitHub uses .tab-size CSS property
    // Inject style to override
    const style = document.createElement('style');
    style.textContent = `
      .blob-code, .highlight pre, .markdown-body pre {
        tab-size: 2 !important;
        -moz-tab-size: 2 !important;
      }
    `;
    document.head.appendChild(style);
  },
});
```

### Handling GitHub's SPA Navigation

GitHub uses Turbo/PJAX - observe navigation:

```typescript
// Use MutationObserver or turbo:load event
document.addEventListener('turbo:load', () => {
  applyTabWidth();
});
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `wxt.config.ts` | WXT configuration (manifest generation) |
| `tsconfig.json` | TypeScript config (extends `.wxt/tsconfig.json`) |
| `package.json` | Dependencies and scripts |

### Manifest Configuration (wxt.config.ts)

```typescript
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: 'Web EditorConfig',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['*://github.com/*'],
  },
});
```

---

## Development Tips

1. **Hot reload**: WXT dev server supports HMR for popup/options pages
2. **Content script reload**: Save file to reload; may need extension reload for manifest changes
3. **Debug**: Use browser DevTools on extension pages; for content scripts, inspect the page
4. **Firefox**: Use `about:debugging` to load temporary extension

---

## Common Tasks

### Add a new content script
Create `src/entrypoints/<name>.content.ts` - WXT auto-discovers entrypoints

### Add storage permission
Update `wxt.config.ts` manifest.permissions array

### Add new popup page
Modify `src/entrypoints/popup/` files or create new entrypoint

---

## Do Not Edit

- `.wxt/` - Auto-generated by WXT
- `.output/` - Build artifacts
- `node_modules/`
