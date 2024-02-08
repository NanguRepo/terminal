import { cwd, overlayWindow } from '$lib/stores';
import { get } from 'svelte/store';
import { createFile, readFile, resolvePath } from '$lib/filesystem';
import { errorMessage } from '$lib/functions';
import { nothing } from '$lib/constants';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument: ', 'pathname required');
	}
	const path = resolvePath(get(cwd) + '/' + input[0]);
	let preexistingText: string = '';
	const fileContent = readFile(path);
	if (fileContent) {
		preexistingText = fileContent;
	}
	overlayWindow.set({ title: 'editor', content: preexistingText, target: path });
	return nothing;
};

export const description = 'edit the contents of a file or create a new file with content.';
