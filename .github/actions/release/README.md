# Release Action

Creates/updates GitHub Release and uploads browser extension ZIPs.

## Usage

Used internally via `actions/github-script@v8`:

```yaml
- uses: ./.github/actions/release
```

## How It Works

The action uses `github-script@v8` to import and execute `src/index.js`, which receives the standard github-script arguments:

- `github` - Pre-authenticated Octokit client
- `context` - Workflow context (repo, ref, etc.)
- `core` - @actions/core (logging, annotations)
- `glob` - @actions/glob (file patterns)

## IDE Support

Install types for autocomplete:

```bash
cd .github/actions/release
bun install
```

The script uses JSDoc for full TypeScript IDE support:

```javascript
/** @param {import('@actions/github-script').AsyncFunctionArguments} args */
export default async ({ github, context, core, glob }) => {
	// Full autocomplete for github.rest.*, context.repo, etc.
};
```

## Release Logic

1. **Find/Create Release** - Gets existing release by tag or creates new one with auto-generated notes
2. **Find Assets** - Globs `.output/*-{chrome,firefox,edge}.zip`
3. **Upload Assets** - Uploads each ZIP to the release

Prereleases detected by `-` in tag (e.g., `v1.0.0-beta.1`).
