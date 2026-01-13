# Contributing

If anyone for some reason feels obliged to work on this project and contribute, feel free.\
I don't, but if you do :monocle_face:, let me know.

## Prerequisites

- [Bun] (recommended) or npm/pnpm/yarn

## Setup

```bash
# Install dependencies
bun install

# Prepare WXT types (if it does not run automatically)
bun run postinstall
```

## Development

```bash
# Development (Chrome)
bun run dev

# Development (Firefox)
bun run dev:firefox

# Type checking
bun run check

# Format code
bun run format
```

## Building

```bash
# Production build
bun run build
bun run build:firefox

# Create distributable zip
bun run zip
bun run zip:firefox
```

## Load Extension

**Chrome/Edge:**

1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `.output/chrome-mv3` directory

**Firefox:**

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in `.output/firefox-mv2` directory

<details>
<summary>📋 Copy browser URLs</summary>

_Chromium-based browsers_

```plaintext
chrome://extensions
```

_Firefox-based browsers_

```plaintext
about:debugging#/runtime/this-firefox
```

</details>

## Project Structure

```tree
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

<!--link-definitions-start-->

[Bun]: https://bun.sh

<!--link-definitions-end-->

<!--markdownlint-disable-file MD033 MD036-->
