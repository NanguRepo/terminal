import { createFile, readFile, directoryExists, resolvePath, deleteFile } from '$lib/filesystem';
import { errorMessage } from '$lib/functions';
import { cwd } from '$lib/stores';
import { get } from 'svelte/store';

export default (input: string[]) => {
	if (input.length != 2) {
		return errorMessage('insufficient arguments: ', 'correct usage is cp <from> <to>');
	}
	const toPath = get(cwd) + '/' + resolvePath(input[1]);
	const fromPath = get(cwd) + '/' + resolvePath(input[0]);
	const fromFile = readFile(fromPath);
	if (!fromFile) {
		if (directoryExists(fromPath)) {
			return errorMessage('path points to a directory');
		}
		return errorMessage('file not found');
	}
	createFile(toPath, fromFile);
	deleteFile(fromPath);
	return [{ text: 'done' }];
};

export const description = 'move a file';
