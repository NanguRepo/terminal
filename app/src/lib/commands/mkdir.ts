import { createDirectory, resolvePath } from '$lib/filesystem';
import { cwd } from '$lib/stores';
import { get } from 'svelte/store';
import { errorMessage } from '$lib/functions';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument', 'pathname required');
	}
	createDirectory(resolvePath(get(cwd) + '/' + input[0]));
	return [{ text: 'directory created: ' + input[0] }];
};
export const description = 'create a directory in a location.';
