import { spawn } from 'node:child_process';
import { glob } from 'node:fs/promises';

const isGitHubActions: boolean = process.env.GITHUB_ACTIONS === 'true';

/** Browsers to create zips for
 * @type {Array<string>}
 * @readonly
 * @example
 * ```js
 * ['chrome', 'firefox', 'edge']
 * ```
 */
const browsers: Array<string> = ['chrome', 'firefox', 'edge'];

/** Glob pattern to find comparison files
 * @type {string}
 * @readonly
 * @example
 * ```txt
 * .output/*-{chrome,firefox,edge}.zip
 * ```
 */
const globComparison: string = `.output/*-{${browsers.join(',')}}.zip` as const;

/** Get the git repository root path
 * @returns The absolute path to the git repository root
 */
const root: Promise<string> = new Promise((resolve, reject) => {
	const proc = spawn('git', ['rev-parse', '--show-toplevel']);
	let data: string = '';
	proc.stdout.on('data', (chunk) => (data += chunk));
	proc.on('close', (code) => (code === 0 ? resolve(data.trim()) : reject(code)));
});

if (!isGitHubActions) {
	console.info(`${await root}/${globComparison}`);

	for await (const entry of glob(globComparison, { cwd: await root })) {
		console.info(entry);
	}
}
