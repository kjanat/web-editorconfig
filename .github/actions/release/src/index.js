// const { Toolkit } = require('actions-toolkit')
// const tools = new Toolkit()

/**
 * @param {import('@actions/github-script').AsyncFunctionArguments} AsyncFunctionArguments
 */
export default async ({ github, context, core, glob }) => {
	const fs = require('node:fs');
	const path = require('node:path');

	const { owner, repo } = context.repo;
	const tag = context.ref.replace('refs/tags/', '');

	// 1) Find or create the release for this tag
	let release;
	try {
		const res = await github.rest.repos.getReleaseByTag({ owner, repo, tag });
		release = res.data;
		core.info(`Found existing release: ${release.html_url}`);
	} catch (e) {
		if (/** @type {any} */ (e).status !== 404) throw e;

		const notes = await github.rest.repos.generateReleaseNotes({
			owner,
			repo,
			tag_name: tag
		});

		const res = await github.rest.repos.createRelease({
			owner,
			repo,
			tag_name: tag,
			name: tag,
			body: notes.data.body ?? '',
			draft: false,
			prerelease: tag.includes('-')
		});

		release = res.data;
		core.info(`Created release: ${release.html_url}`);
	}

	// 2) Use the INJECTED glob helper (no import needed)
	const patterns = ['.output/*-chrome.zip', '.output/*-firefox.zip', '.output/*-edge.zip'].join(
		'\n'
	);

	const globber = await glob.create(patterns, { followSymbolicLinks: false });
	const files = await globber.glob();

	if (!files.length) {
		core.setFailed(`No release assets found matching:\n${patterns}`);
		return;
	}

	core.info(`Uploading ${files.length} asset(s):\n- ${files.join('\n- ')}`);

	// 3) Upload each zip
	for (const file of files) {
		const name = path.basename(file);
		const data = fs.readFileSync(file);

		await github.rest.repos.uploadReleaseAsset({
			owner,
			repo,
			release_id: release.id,
			name,
			data: /** @type {any} */ (data),
			headers: {
				'content-type': 'application/zip',
				'content-length': data.length
			}
		});

		core.notice(`Uploaded: ${name}`);
	}
};
