<script lang="ts">
	import { tabWidthState } from '@/lib/tab-width-state.svelte';

	let inputValue = $state(tabWidthState.value);
	let saved = $state(false);

	// Sync input when store changes (e.g., from another context)
	$effect(() => {
		inputValue = tabWidthState.value;
	});

	async function save() {
		await tabWidthState.save(inputValue);
		saved = true;
		setTimeout(() => {
			saved = false;
		}, 1500);
	}
</script>

<main>
	<div class="header">
		<img src="/icon.svg" class="logo" alt="Web EditorConfig" />
		<h1>Web EditorConfig</h1>
	</div>

	<div class="setting">
		<label for="tabwidth">Tab Width</label>
		<div class="input-row">
			<input type="number" id="tabwidth" min="1" max="16" bind:value={inputValue} />
			<button onclick={save} class:saved>
				{saved ? 'Saved!' : 'Save'}
			</button>
		</div>
	</div>

	<p class="hint">Applies to all GitHub code views</p>
</main>

<style>
	main {
		width: 240px;
		padding: 1rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.logo {
		width: 32px;
		height: 32px;
	}

	h1 {
		font-size: 1rem;
		margin: 0;
		font-weight: 600;
	}

	.setting {
		margin-bottom: 0.75rem;
	}

	label {
		display: block;
		font-size: 0.85rem;
		margin-bottom: 0.25rem;
		color: #666;
	}

	.input-row {
		display: flex;
		gap: 0.5rem;
	}

	input {
		flex: 1;
		padding: 0.4rem 0.6rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		padding: 0.4rem 0.8rem;
		background: #24292e;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: background 0.2s;
	}

	button:hover {
		background: #444;
	}

	button.saved {
		background: #2ea44f;
	}

	.hint {
		font-size: 0.75rem;
		color: #888;
		margin: 0;
	}
</style>
