import { readFile } from '../components/filesystem';
import { errorMessage } from '../components/functions';
import { cwd } from '../components/stores';
import { get } from 'svelte/store';
import config from './config';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no input: ', 'please specify a file path');
	}
	const lines = readFile(get(cwd) + '/' + input[0]);
	if (lines === null) {
		return errorMessage('file not found: ', input[0]);
	}
	if (lines === undefined) {
		return errorMessage('unknown error');
	}
	for (const line of lines.split('\n')) {
		config(line.split(' '));
	}
	return [{ text: 'config loaded: ' + input[0].split('/').splice(-1)[0] }];
};
export const description = "load a file"