import { cwd, overlayWindow, editorWindow } from '../components/stores';
import { get } from 'svelte/store';
import { createFile, readFile } from '../components/filesystem';
import { errorMessage } from '../components/functions';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument: ', 'pathname required');
	}
	const path = get(cwd) + '/' + input[0];
	let preexistingText: string = '';
	const fileContent = readFile(path);
	if (fileContent) {
		preexistingText = fileContent;
	}
	overlayWindow.set({ title: 'editor', content: preexistingText });
	const editor = get(editorWindow)
	editor.focus()
	// createFile(path, fileContent)
	// return [{text: `file created: ${input[0]}\nwith content: ${content}`, style: ''}];
};

export const description = 'edit the contents of a file or create a new file with content.';
