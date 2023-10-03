<script lang="ts">
	import { log, terminalLines, config, cwd } from './components/stores';
	import { print, controller, logCommand } from './components/functions';
	let command: string = '';
	let logIndex = -1;
	const enterCommand = () => {
		logCommand(command);
		logIndex = -1;
		print([
			{
				text: $config.prompt == ' ' ? command : $config.prompt + ' ' + command,
				style: ''
			}
		]);
		if (command != '') {
			print(controller(command.split(' ')));
		}
		print([
			{ text: '\n', style: '' },
			{ text: $cwd, style: '' }
		]);
		command = '';
	};
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css?family=Fira Code" rel="stylesheet" />
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
			{#if $config.prompt != ' '}
				<span>{$config.prompt}</span>
			{/if}
			<form class="w-full h-full p-0">
				<textarea
					bind:value={command}
					class="p-0 w-full h-full"
					wrap="soft"
					style="outline: none; font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}; {$config.customcss}"
					spellcheck="false"
					autofocus
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
		{#each $terminalLines as parts}
        <p class="whitespace-pre-wrap">
			{#each parts as line}
				<span style={line.style}>{line.text}</span>
			{/each}
        </p>
		{/each}
	</div>
</div>
