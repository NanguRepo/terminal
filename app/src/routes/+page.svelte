<script lang="ts">
	import { log, terminalLines, config, cwd } from './components/stores';
	import { print, controller, logCommand } from './components/functions';
	import { onMount } from 'svelte';
	let command: string = '';
	let commandInput: HTMLTextAreaElement;
	onMount(() => {
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
	class="w-full h-screen flex flex-col justify-center items-center"
	style="background-color: {$config.containercolor}"
>
	<div
		class="flex flex-col-reverse overflow-y-scroll overflow-x-hidden w-3/4 h-2/3 p-4 rounded-2xl font-mono"
		style="font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
	>
		<div class="flex flex-row w-full h-full gap-[1ch] p-0">
			{#if $config.prompt != 'false'}
				<span class="h-fit" style={$config.promptstyle}>{$config.prompt}</span>
			{/if}
			<form class="w-full h-full p-0">
				<textarea
					bind:value={command}
					bind:this={commandInput}
					class="p-0 w-full h-full"
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
	</div>
</div>
