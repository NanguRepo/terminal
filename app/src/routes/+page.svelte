<script lang="ts">
	import {
		log,
		terminalLines,
		config,
		cwd,
		overlayWindow,
		processing,
		interrupted
	} from '$lib/stores';
	import { print, controller, logCommand } from '$lib/functions';
	import { readFile } from '$lib/filesystem';
	import EditorUi from '$lib/components/editorUI.svelte';
	import { onMount } from 'svelte';
	import Layout from './+layout.svelte';
	let command: string = '';
	let commandInput: HTMLTextAreaElement;
	let modifierKeyDown: boolean = false;
	onMount(async () => {
		const bushrc = readFile('root/~/.bushrc');
		if (bushrc) {
			for (const line of bushrc.split('\n')) {
				const response = await controller(line);
				print(response);
			}
		}
		print([{ text: $cwd.slice(5), style: $config.cwdstyle }]);
		commandInput.focus();
	});
	let logIndex = -1;
	const enterCommand = async () => {
		if ($processing) {
			print([{ text: command }]);
			command = '';
			return;
		}
		logCommand(command);
		logIndex = -1;
		print([
			{
				text: $config.prompt == 'false' ? command : $config.prompt + ' ' + command
			}
		]);
		if (command != '') {
			const input = command;
			command = '';
			const response = await controller(input);
			print(response);
		}
		print([{ text: $cwd.length == 4 ? $cwd : $cwd.slice(5), style: $config.cwdstyle }]);
	};
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css?family=Fira%20Code" rel="stylesheet" />
	<style></style>
</svelte:head>

<div
	class="flex h-screen w-full flex-col items-center justify-center"
	style="background-color: {$config.containercolor}"
>
	<div
		class="absolute flex h-2/3 w-3/4 flex-col-reverse overflow-x-hidden overflow-y-scroll rounded-2xl p-4 font-mono"
		style="font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
	>
		{#if $overlayWindow.title == 'editor'}
			<EditorUi />
		{:else}
			<div class="flex h-full w-full flex-row gap-[1ch] p-0">
				{#if $config.prompt != 'false' && !$processing}
					<span class="h-fit" style={$config.promptstyle}>{$config.prompt}</span>
				{/if}
				<form class="h-full w-full p-0">
					<textarea
						bind:value={command}
						bind:this={commandInput}
						class="h-full w-full p-0"
						wrap="soft"
						style="outline: none; font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
						spellcheck="false"
						on:keyup={(e) => {
							if (e.key === 'Control') {
								e.preventDefault();
								modifierKeyDown = false;
							}
						}}
						on:keydown={(e) => {
							if (e.key === 'Control') {
								e.preventDefault();
								modifierKeyDown = true;
							}
							if (e.key === 'c' && modifierKeyDown) {
								if ($processing) {
									$interrupted = true;
									print([
										{
											text: command + '^C'
										}
									]);
									command = '';
								} else {
									print([
										{
											text: $config.prompt == 'false' ? command : $config.prompt + ' ' + command
										}
									]);
									command = '';
								}
							}
							if (e.key == 'Enter') {
								e.preventDefault();
								enterCommand();
							}
							if (e.key == 'ArrowUp') {
								e.preventDefault();
								logIndex++;
								command = $log.toReversed()[logIndex];
							}
							if (e.key == 'ArrowDown') {
								e.preventDefault();
								if (logIndex > -1) {
									logIndex--;
									command = $log.toReversed()[logIndex];
								} else if (logIndex == -1) {
									command = '';
								}
							}
						}}
					/>
				</form>
			</div>
			{#each $terminalLines as line}
				{#if !(line.length == 1 && line[0].text === undefined)}
					<p class="whitespace-pre-wrap">
						{#each line as part}
							{#if part.url}
								<a
									href={part.url}
									style={part.style}
									class="text-blue-400 hover:text-blue-500 hover:underline">{part.text}</a
								>
							{:else}
								<span style={part.style}>{part.text}</span>{/if}
						{/each}
					</p>
				{/if}
			{/each}
		{/if}
	</div>
</div>
