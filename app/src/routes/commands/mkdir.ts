import { createDirectory, resolvePath } from '../components/filesystem';
import { cwd } from '../components/stores';
import { get } from 'svelte/store';
import { errorMessage } from '../components/functions';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no input: ', 'pathname required');
	}
	createDirectory(resolvePath(get(cwd) + '/' + input[0]));
	return [{ text: 'directory created: ' + input[0] }];
};
export const description = "create a directory in a location."