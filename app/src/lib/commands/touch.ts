import { createFile, fileExists, directoryExists, resolvePath } from '$lib/filesystem';
import { errorMessage } from '$lib/functions';
import { cwd } from '$lib/stores';
import { get } from 'svelte/store';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument', 'pathname required');
	}
	const path = resolvePath(get(cwd) + '/' + input[0]);
	if (fileExists(path) || directoryExists(path)) {
		return errorMessage('invalid path', 'a file or directory already exists in that location');
	}
	createFile(path, '');
	return [{ text: `file created: ${input[0]}`, style: '' }];
};

export const description = 'create a file in a location.';
