<script lang="ts">
	import { terminalLines } from './components/stores';
	import { print, controller } from './components/functions';
	let commandInput: any;
	let command: string;
	const enterCommand = () => {
		print('$ ' + command);
		print(controller(command.split(' ')));
		command = '';
	};
</script>

<div class="w-full h-screen flex flex-col justify-center items-center bg-black">
	<div
		class="flex flex-col-reverse overflow-scroll w-3/4 h-2/3 p-4 rounded-2xl bg-neutral-800 text-white font-mono"
	>
		<div class="flex flex-row w-full h-full gap-[1ch] p-0">
			<span>$</span>
			<form class="w-full h-full p-0">
				<textarea
					bind:this={commandInput}
					bind:value={command}
					class="bg-neutral-800 text-white font-mono p-0 w-full h-full"
					wrap="soft"
					style="outline: none"
					autofocus
					on:keydown={(e) => {
						if (e.key == 'Enter') {
							e.preventDefault();
							enterCommand();
						}
					}}
				/>
			</form>
		</div>
		{#each $terminalLines as line, i}
			<p class="font-mono">{line}</p>
		{/each}
	</div>
</div>
