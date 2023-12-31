import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';

const getFileSystem = (item: string, fallback: fileSystemFolder) => {
	try {
		const fileSystemLoaded = localStorage.getItem(item);
		if (!fileSystemLoaded) {
			return fallback;
		}
		return JSON.parse(fileSystemLoaded);
	} catch {
		return fallback;
	}
};

export type fileSystemFolder = {
	[Key: string]: string | fileSystemFolder;
};

export const log = writable(['']);

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
export const terminalLines: Writable<[[{ text?: string; style?: string }]]> = writable([[{}]]);
export const fileSystem: Writable<fileSystemFolder> = writable(
	getFileSystem('filesystem', {
		root: {
			'~': {
				'.aliases':
					'dir=ls\nvim=edit\nread=cat\ncls=clear\nconf=config\ndelete=rm\nplease=sudo\ncreate=touch',
				'.bushrc': 'load themes/default.conf',
				themes: {
					'commodore.conf':
						'backgroundcolor #483AAA\ncontainercolor #867ADE\ntextcolor #867ADE\ncustomcss font-family: c64; text-transform: uppercase; border-radius: 0px;\nprompt false\ncwdstyle color: #867ADE',
					'default.conf': ''
				}
			}
		}
	})
);
export const cwd = writable('root/~');
export const overlayWindow = writable({
	title: '',
	content: '',
	target: ''
})