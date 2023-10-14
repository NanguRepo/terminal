<script lang="ts">
	import { log, terminalLines, config, cwd, overlayWindow, editorWindow } from './components/stores';
	import { print, controller, logCommand } from './components/functions';
	import { readFile } from './components/filesystem';
	import { onMount } from 'svelte';
	let command: string = '';
	let commandInput: HTMLTextAreaElement;
	let modifierKeyDown: boolean = false;
	onMount(() => {
		const autoexec = readFile('root/~/.autoexec');
		if (autoexec) {
			for (const line of autoexec.split('\n')) {
				controller(line.split(' '));
			}
		}
		print([{ text: '\n' + $cwd.slice(5), style: 'font-weight: bold; color: cyan;' }]);
		commandInput.focus();
	});
	let logIndex = -1;
	const enterCommand = () => {
		logCommand(command);
		logIndex = -1;
		print([
			{
				text: $config.prompt == 'false' ? command : $config.prompt + ' ' + command,
				style: ''
			}
		]);
		if (command != '') {
			print(controller(command.split(' ')));
		}
		print([{ text: '\n' + ($cwd.length == 4 ? $cwd : $cwd.slice(5)), style: $config.cwdstyle }]);
		command = '';
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
			<textarea
				class="h-full w-full rounded-lg border border-neutral-700 p-2"
				wrap="soft"
				bind:this={$editorWindow}
				bind:value={$overlayWindow.content}
				style="outline: none; font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
				spellcheck="false"
				on:keydown={(e) => {
					if (e.key === 'Control') {
						e.preventDefault();
						modifierKeyDown = true;
					}
					if (e.key === 'x' && modifierKeyDown) {
						e.preventDefault();
						console.log('saved');
					}
				}}
				on:keyup={(e) => {
					if (e.key === 'Control') {
						e.preventDefault();
						modifierKeyDown = false;
					}
				}}
			/>
		{:else}
			<div class="flex h-full w-full flex-row gap-[1ch] p-0">
				{#if $config.prompt != 'false'}
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
						on:keydown={(e) => {
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
				<p class="whitespace-pre-wrap">
					{#each line as part}
						<span style={part.style}>{part.text}</span>
					{/each}
				</p>
			{/each}
		{/if}
	</div>
</div>
