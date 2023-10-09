import { get } from 'svelte/store';
import { terminalLines, log } from './stores';

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
export const controller = (input: string[]) => {
	if (input[0] == '') {
		return '';
	}
	const commandName: string = input[0].toLowerCase().replace('a/', 'aliases/');
	if (`../commands/${commandName}.ts` in modules) {
		return modules[`../commands/${commandName}.ts`]?.default(input.slice(1));
	}
	return errorMessage('command not found: ', input[0]);
};

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
