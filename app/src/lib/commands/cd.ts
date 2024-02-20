import { cwd } from '$lib/stores';
import { errorMessage } from '$lib/functions';
import { directoryExists, resolvePath } from '$lib/filesystem';
import { get } from 'svelte/store';
import { nothing } from '$lib/constants';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument', 'pathname required');
	}
	if (input[0].slice(-1) == '/') {
		input[0] = input[0].slice(0, -1);
	}
	const path = resolvePath(get(cwd) + '/' + input[0]);
	if (!directoryExists(path)) {
		return errorMessage('directory not found', path);
	}
	cwd.set(path);
	return nothing;
};
export const description = 'change current working directory.';
