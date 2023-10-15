import { cwd, overlayWindow } from '../components/stores';
import { get } from 'svelte/store';
import { createFile, readFile, resolvePath } from '../components/filesystem';
import { errorMessage } from '../components/functions';

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
	return [{}]
};

export const description = 'edit the contents of a file or create a new file with content.';
