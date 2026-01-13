# Web EditorConfig

Browser extension for customizing tab-width rendering on GitHub and other code hosting platforms. Brings EditorConfig-like tab display preferences to your browser.

## Features

- Customize tab width display on GitHub code views
- Global tab width setting (applies to all GitHub pages)
- Supports GitHub's SPA navigation (Turbo)
- Lightweight, no external dependencies at runtime

## Installation

### From Source

```bash
# Install dependencies
bun install

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
```

### Load Extension

**Chrome/Edge:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `.output/chrome-mv3` directory

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in `.output/firefox-mv2` directory

## Tech Stack

- [WXT](https://wxt.dev) - Next-gen web extension framework
- [Svelte 5](https://svelte.dev) - UI framework with runes
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Project Structure

```
src/
  entrypoints/       # Extension entry points
    background.ts    # Service worker
    content.ts       # Injected into web pages
    popup/           # Browser action popup
  lib/               # Shared components
  assets/            # Static assets
public/
  icon/              # Extension icons
```

## Development

```bash
# Type checking
bun run check

# Prepare WXT types
bun run postinstall
```

## License

MIT
