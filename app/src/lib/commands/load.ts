import { readFile } from '$lib/filesystem';
import { errorMessage, controller } from '$lib/functions';
import { cwd } from '$lib/stores';
import { get } from 'svelte/store';
import config from './config';

export default async (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument', 'pathname required');
	}
	const lines = readFile(get(cwd) + '/' + input[0]);
	if (lines === null) {
		return errorMessage('file not found', input[0]);
	}
	if (lines === undefined) {
		return errorMessage('unknown error');
	}
	const extension = input[0].split('/').slice(-1)[0].split('.').slice(-1)[0];
	if (extension == 'conf') {
		for (const line of lines.split('\n')) {
			config(line.split(' '));
		}
		return [{ text: 'config loaded: ' + input[0].split('/').splice(-1)[0] }];
	}
	if (extension == 'script') {
		const output = [];
		for (const line of lines.split('\n')) {
			output.push(...(await controller(line)), { text: '\n' });
		}
		return output;
	}
};
export const description = 'load a file';
