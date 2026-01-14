<script lang="ts">
	import iconUrl from '@/assets/icon.svg';
	import { tabWidthState } from '@/lib/tab-width-state.svelte';

	const DIGIT_MAP: Record<number, string[]> = {
		0: ['a', 'b', 'c', 'd', 'e', 'f'],
		1: ['b', 'c'],
		2: ['a', 'b', 'g', 'e', 'd'],
		3: ['a', 'b', 'g', 'c', 'd'],
		4: ['f', 'g', 'b', 'c'],
		5: ['a', 'f', 'g', 'c', 'd'],
		6: ['a', 'f', 'g', 'e', 'c', 'd'],
		7: ['a', 'b', 'c'],
		8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
		9: ['a', 'b', 'c', 'd', 'f', 'g']
	};

	const DEFAULT_VALUE = 4;

	let inputValue = $state(tabWidthState.value);
	let menuOpen = $state(false);

	// Sync input when store changes
	$effect(() => {
		inputValue = tabWidthState.value;
	});

	// Auto-save on change
	$effect(() => {
		if (inputValue !== tabWidthState.value) {
			tabWidthState.save(inputValue);
		}
	});

	function getActiveSegments(value: number): Set<string> {
		// Handle two digits
		const ones = value % 10;
		return new Set(DIGIT_MAP[ones] || []);
	}

	function getTensSegments(value: number): Set<string> | null {
		if (value < 10) return null;
		const tens = Math.floor(value / 10);
		return new Set(DIGIT_MAP[tens] || []);
	}

	function decrement() {
		inputValue = Math.max(1, inputValue - 1);
	}

	function increment() {
		inputValue = Math.min(16, inputValue + 1);
	}

	function reset() {
		inputValue = DEFAULT_VALUE;
		menuOpen = false;
	}

	$effect(() => {
		if (!menuOpen) return;
		const handler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest('.menu-container')) {
				menuOpen = false;
			}
		};
		document.addEventListener('click', handler);
		return () => document.removeEventListener('click', handler);
	});

	const tensSegs = $derived(getTensSegments(inputValue));
	const onesSegs = $derived(getActiveSegments(inputValue));
</script>

<main>
	<div class="header">
		<div class="header-title">
			<img src={iconUrl} class="logo" alt="Web EditorConfig" />
			<h1>Web EditorConfig</h1>
		</div>
		<div class="menu-container">
			<button class="menu-btn" onclick={() => (menuOpen = !menuOpen)} aria-label="Menu">
				<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
					<circle cx="8" cy="2" r="1.5"></circle>
					<circle cx="8" cy="8" r="1.5"></circle>
					<circle cx="8" cy="14" r="1.5"></circle>
				</svg>
			</button>
			{#if menuOpen}
				<div class="menu-dropdown">
					<button onclick={reset}>Reset to default</button>
				</div>
			{/if}
		</div>
	</div>

	<div class="setting">
		<!-- svelte-ignore a11y_label_has_associated_control (decorative label for custom control) -->
		<label>Tab Width</label>
		<div class="clock-display">
			<button class="clock-btn" onclick={decrement} disabled={inputValue <= 1}>-</button>
			<div class="digits-row">
				{#if tensSegs}
					<div class="digit-container" aria-label={String(Math.floor(inputValue / 10))}>
						<svg viewBox="0 0 80 140" class="digit-svg" aria-hidden="true">
							<rect
								class="seg"
								class:on={tensSegs.has('a')}
								x="16"
								y="10"
								rx="4"
								ry="4"
								width="48"
								height="10"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('b')}
								x="64"
								y="18"
								rx="4"
								ry="4"
								width="10"
								height="52"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('c')}
								x="64"
								y="70"
								rx="4"
								ry="4"
								width="10"
								height="52"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('d')}
								x="16"
								y="120"
								rx="4"
								ry="4"
								width="48"
								height="10"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('e')}
								x="6"
								y="70"
								rx="4"
								ry="4"
								width="10"
								height="52"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('f')}
								x="6"
								y="18"
								rx="4"
								ry="4"
								width="10"
								height="52"
							></rect>
							<rect
								class="seg"
								class:on={tensSegs.has('g')}
								x="16"
								y="65"
								rx="4"
								ry="4"
								width="48"
								height="10"
							></rect>
						</svg>
					</div>
				{/if}
				<div class="digit-container" aria-label={String(inputValue % 10)}>
					<svg viewBox="0 0 80 140" class="digit-svg" aria-hidden="true">
						<rect
							class="seg"
							class:on={onesSegs.has('a')}
							x="16"
							y="10"
							rx="4"
							ry="4"
							width="48"
							height="10"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('b')}
							x="64"
							y="18"
							rx="4"
							ry="4"
							width="10"
							height="52"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('c')}
							x="64"
							y="70"
							rx="4"
							ry="4"
							width="10"
							height="52"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('d')}
							x="16"
							y="120"
							rx="4"
							ry="4"
							width="48"
							height="10"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('e')}
							x="6"
							y="70"
							rx="4"
							ry="4"
							width="10"
							height="52"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('f')}
							x="6"
							y="18"
							rx="4"
							ry="4"
							width="10"
							height="52"
						></rect>
						<rect
							class="seg"
							class:on={onesSegs.has('g')}
							x="16"
							y="65"
							rx="4"
							ry="4"
							width="48"
							height="10"
						></rect>
					</svg>
				</div>
			</div>
			<button class="clock-btn" onclick={increment} disabled={inputValue >= 16}>+</button>
		</div>
	</div>

	<p class="hint">Applies to all GitHub code views</p>
</main>

<style>
	main {
		--seg-on: #ff2b2b;
		--seg-off: rgba(255, 40, 40, 0.08);
		--bevel1: rgba(255, 255, 255, 0.08);
		--bevel2: rgba(0, 0, 0, 0.6);

		width: 280px;
		padding: 1.25rem;
		background:
			radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.04), transparent 60%),
			linear-gradient(180deg, #121318, #0a0b0e);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.25rem;
		position: relative;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.logo {
		width: 28px;
		height: 28px;
		user-select: none;
		pointer-events: none;
	}

	h1 {
		font-size: 0.95rem;
		margin: 0;
		font-weight: 600;
		color: #ddd;
	}

	h1::selection {
		background: #a6e22e;
		color: #272822;
	}

	.menu-container {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.menu-btn {
		width: 24px;
		height: 24px;
		border: none;
		background: transparent;
		color: #555;
		cursor: pointer;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
	}

	.menu-btn:hover {
		color: #888;
		background: rgba(255, 255, 255, 0.05);
	}

	.menu-dropdown {
		position: absolute;
		right: 0;
		top: 100%;
		margin-top: 4px;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 6px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		overflow: hidden;
		z-index: 10;
	}

	.menu-dropdown button {
		display: block;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: none;
		background: transparent;
		color: #aaa;
		font-size: 0.75rem;
		text-align: left;
		cursor: pointer;
		white-space: nowrap;
	}

	.menu-dropdown button:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}

	.setting {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	label {
		display: block;
		font-size: 0.7rem;
		margin-bottom: 0.75rem;
		color: #555;
		user-select: none;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.clock-display {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.digits-row {
		display: flex;
		gap: 6px;
	}

	.digit-container {
		width: 56px;
		height: 100px;
		display: grid;
		place-items: center;
		border-radius: 12px;
		background:
			radial-gradient(120% 120% at 30% 20%, rgba(255, 255, 255, 0.06), transparent 55%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 35%),
			linear-gradient(180deg, #0c0d10, #060709);
		box-shadow:
			inset 0 1px 0 var(--bevel1),
			inset 0 -8px 16px var(--bevel2),
			0 10px 30px rgba(0, 0, 0, 0.5);
		padding: 6px;
	}

	.digit-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 8px rgba(255, 20, 20, 0.25))
			drop-shadow(0 0 16px rgba(255, 20, 20, 0.15));
	}

	.seg {
		fill: var(--seg-off);
		transition: fill 100ms linear;
	}

	.seg.on {
		fill: var(--seg-on);
		filter: drop-shadow(0 0 4px rgba(255, 40, 40, 0.5));
	}

	.clock-btn {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.3));
		color: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 1.25rem;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		user-select: none;
	}

	.clock-btn:hover:not(:disabled) {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.25));
		color: #fff;
	}

	.clock-btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	.clock-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.hint {
		font-size: 0.65rem;
		color: #444;
		margin: 0;
		margin-top: 1rem;
		user-select: none;
		text-align: center;
	}
</style>
