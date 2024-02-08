import { deleteFile, resolvePath, directoryExists } from '$lib/filesystem';
import { cwd } from '$lib/stores';
import { get } from 'svelte/store';
import { errorMessage } from '$lib/functions';

const important: string[] = ['root', 'root/~', 'root/~/.aliases', 'root/~/.bushrc'];

export default (input: string[], sudo: boolean = false) => {
	if (!input[0]) {
		return errorMessage('no argument: ', 'pathname required');
	}
	const path = resolvePath(get(cwd) + '/' + input[0]);
	if (important.includes(path) && !sudo) {
		return errorMessage(
			'protected file: ',
			input[0] + '\nre-run this command with sudo to force deletion'
		);
	}
	if (directoryExists(path) && !sudo) {
		return errorMessage(
			'path points to a directory: ',
			're-run this command with sudo to force deletion'
		);
	}
	if (deleteFile(path)) {
		return [{ text: 'file deleted: ' + input[0] }];
	}
	return errorMessage('file not found: ', input[0]);
};
export const description = 'delete a file.';
