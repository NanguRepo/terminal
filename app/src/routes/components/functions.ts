import { get } from 'svelte/store';
import { terminalLines, log } from './stores';
import { readFile } from './filesystem';

export const logCommand = (command: string) => {
	log.set([...get(log), command]);
};

export type terminalLine = {
	text: string;
	style?: string;
}[];

export const print = (input: terminalLine) => {
	terminalLines.set([input, ...get(terminalLines)]);
};

// use vite glob import to get every command within the folder
export const modules = import.meta.glob('../commands/*.ts', { eager: true });
export const controller = (input: string[], sudo: boolean = false) => {
	if (input[0] == '') {
		return '';
	}
	const commandName: string = getAlias(input[0].toLowerCase());
	if (`../commands/${commandName}.ts` in modules) {
		return modules[`../commands/${commandName}.ts`]?.default(input.slice(1), sudo);
	}
	return errorMessage('command not found: ', input[0]);
};

const getAlias = (input: string) => {
	const aliases = readFile('root/~/.aliases')
	if (aliases) {
		for (const line of aliases.split('\n')) {
			if (input == line.split('=')[0]) {
				return line.split('=')[1]
			}
		}
	}
	return input
}

export const errorMessage = (message: string, detail?: string) => {
	return [
		{
			text: 'Error: ',
			style: 'color: #FF6666; font-weight: bold'
		},
		{
			text: message,
			style: 'color: #FFAAAA;'
		},
		{
			text: detail || ''
		}
	];
};
