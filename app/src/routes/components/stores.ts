import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type fileSystemFolder = {
	[Key: string]: string | fileSystemFolder;
};

export const log = writable(['']);
export const terminalLines: Writable<[[{text: string, style?: string}]]> = writable([
	[
		{
			text: 'Terminal <c> NanguRepo 2023',
			style: 'color: cyan'
		}
	]
]);
export const configDefaults: Record<string, string> = {
	fontsize: '20px',
	textcolor: '#FFFFFF',
	backgroundcolor: '#171717',
	containercolor: '#000000',
	customcss: '',
	prompt: '>',
	promptstyle: 'font-weight: 900; text-decoration: underline;'
};
export const config = writable(configDefaults);
export const fileSystem: Writable<fileSystemFolder> = writable(
	{
		'root': {
			'~': {} 
		} 
	}
);
export const cwd = writable('root/~');
