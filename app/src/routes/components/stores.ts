import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type fileSystemFolder = {
	[Key: string]: string | fileSystemFolder;
};

export const log = writable(['']);
export const terminalLines: Writable<[[{ text: string; style?: string }]]> = writable([
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
	promptstyle: 'font-weight: 900; text-decoration: underline;',
	cwdstyle: 'font-weight: bold; color: cyan;'
};
export const config = writable(configDefaults);
export const fileSystem: Writable<fileSystemFolder> = writable({
	root: {
		'~': {
			'.aliases':
				'dir=ls\nvim=edit\nread=cat\ncls=clear\nconf=config\ndelete=rm\nplease=sudo\ncreate=touch',
			configs: {
				'commodore.conf':
					'backgroundcolor #483AAA\ncontainercolor #867ADE\ntextcolor #867ADE\ncustomcss font-family: c64; text-transform: uppercase; border-radius: 0px;\nprompt false\ncwdstyle color: #867ADE'
			}
		}
	}
});
export const cwd = writable('root/~');
