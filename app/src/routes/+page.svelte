<script lang="ts">
	import { log, terminalLines, config } from './components/stores';
	import { print, controller, logCommand } from './components/functions';
	let command: string = '';
	let logIndex = 0;
	const enterCommand = () => {
		logCommand(command);
		print('$ ' + command);
		if (command != '') {
			print(controller(command.split(' ')));
			print('\n');
		}
		command = '';
	};
</script>

<div class="w-full h-screen flex flex-col justify-center items-center bg-black">
	<div
		class="flex flex-col-reverse overflow-scroll w-3/4 h-2/3 p-4 rounded-2xl font-mono"
		style="font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}"
	>
		<div class="flex flex-row w-full h-full gap-[1ch] p-0">
			<span>$</span>
			<form class="w-full h-full p-0">
				<textarea
					bind:value={command}
					class="font-mono p-0 w-full h-full"
					wrap="soft"
					style="outline: none; font-size: {$config.fontsize}; color: {$config.textcolor}; background-color: {$config.backgroundcolor}"
					spellcheck="false"
					autofocus
					on:keydown={(e) => {
						if (e.key == 'Enter') {
							e.preventDefault();
							enterCommand();
						}
						if (e.key == 'ArrowUp') {
							logIndex++;
							command = $log.slice(-logIndex)[0];
						}
						if (e.key == 'ArrowDown' && logIndex > 0) {
							logIndex--;
							command = $log.slice(-logIndex)[0];
						}
					}}
				/>
			</form>
		</div>
		{#each $terminalLines as line, i}
			<p class="font-mono whitespace-pre">{line}</p>
		{/each}
	</div>
</div>
