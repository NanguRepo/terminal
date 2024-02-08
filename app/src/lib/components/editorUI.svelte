<script lang="ts">
	import { overlayWindow, config } from '$lib/stores';
	import { onMount } from 'svelte';
	import { createFile } from '$lib/filesystem';
	let modifierKeyDown: boolean = false;
	let editorElement: HTMLTextAreaElement;
	onMount(() => {
		editorElement.focus();
	});
</script>

<textarea
	class="h-full w-full rounded-lg border border-neutral-700 p-2"
	wrap="soft"
	bind:value={$overlayWindow.content}
	bind:this={editorElement}
	style="outline: none; font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
	spellcheck="false"
	on:keydown={(e) => {
		if (e.key === 'Control') {
			e.preventDefault();
			modifierKeyDown = true;
		}
		if (e.key === 'x' && modifierKeyDown) {
			e.preventDefault();
			createFile($overlayWindow.target, $overlayWindow.content);
			$overlayWindow = {
				title: '',
				content: '',
				target: ''
			};
		}
	}}
	on:keyup={(e) => {
		if (e.key === 'Control') {
			e.preventDefault();
			modifierKeyDown = false;
		}
	}}
/>
