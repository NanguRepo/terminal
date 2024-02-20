import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { terminalLine } from './functions';

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

export const processing = writable(false);
export const interrupted = writable(false);
export const replacePrevious = writable(false);
export const printingBlocked = writable(false);

export const configDefaults: Record<string, string> = {
	fontsize: '',
	textcolor: '',
	backgroundcolor: '',
	containercolor: '',
	customcss: '',
	prompt: '',
	promptstyle: '',
	cwdstyle: ''
};
export const config: Writable<Record<string, string>> = writable(configDefaults);
export const terminalLines: Writable<terminalLine[]> = writable([]);
export const fileSystem: Writable<fileSystemFolder> = writable(
	getFileSystem('filesystem', {
		root: {
			'~': {
				'.aliases':
					'dir=ls\nvim=edit\nread=cat\ncls=clear\nconf=config\ndelete=rm\nplease=sudo\ncreate=touch\nrefresh=reload',
				'.bushrc':
					'cd ~\necho "bush – basically useless shell" "color: cyan"\nsilent load themes/default.conf',
				themes: {
					'commodore.conf':
						'backgroundcolor #483AAA\ncontainercolor #867ADE\ntextcolor #867ADE\ncustomcss font-family: c64; text-transform: uppercase; border-radius: 0px;\nprompt false\ncwdstyle color: #867ADE',
					'default.conf':
						'fontsize 20px\ntextcolor #FFFFFF\nbackgroundcolor #171717\ncontainercolor #000000\nprompt $\ncwdstyle font-weight: bold; color: cyan;',
					'light.conf':
						'fontsize 20px\ntextcolor #000000\nbackgroundcolor #FFFFFF\ncontainercolor #FFFFFF\nprompt $\ncwdstyle font-weight: bold; color: red;'
				}
			}
		}
	})
);
export const cwd = writable('root');
export const overlayWindow = writable({
	title: '',
	content: '',
	target: ''
});

replacePrevious.subscribe((value) => {
	if (value && get(printingBlocked)) {
		replacePrevious.set(false);
	}
});
