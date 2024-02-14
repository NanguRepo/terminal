import { fileSystem, cwd } from '$lib/stores';
import type { fileSystemFolder } from '$lib/stores';
import type { terminalLine } from '$lib/functions';
import { isObject, resolvePath } from '$lib/filesystem';
import { get } from 'svelte/store';
import { errorMessage } from '$lib/functions';

export default (input: string[]): terminalLine => {
	let directory = get(cwd);
	if (input[0]) {
		directory += `/${input[0]}`;
	}
	const response = ls(resolvePath(directory), get(fileSystem));
	if (response as terminalLine) {
		return response as terminalLine;
	} else {
		const error = response as string[];
		return errorMessage(error[0], error[1]);
	}
};

const ls = (currentDirectory: string, filesystem: fileSystemFolder) => {
	const pathElements = currentDirectory.split('/').filter((element) => element !== ''); // Split and remove empty elements
	let currentObject = filesystem;

	// Traverse the filesystem based on the path in the currentDirectory
	for (const element of pathElements) {
		currentObject = currentObject[element];
		if (!currentObject && currentObject !== '') {
			return errorMessage('directory not found: ', element);
		}
	}

	if (isObject(currentObject)) {
		const contents = Object.keys(currentObject);
		const files: terminalLine = [];
		const folders: terminalLine = [];
		for (const item of contents) {
			if (isObject(currentObject[item])) {
				folders.push({ text: item + '\t\t', style: 'font-weight: bold; color: #22AAFF;' });
			} else {
				files.push({ text: item + '\t\t', style: '' });
			}
		}
		folders.sort((a, b) => {
			return a.text.localeCompare(b.text);
		});
		files.sort((a, b) => {
			return a.text.localeCompare(b.text);
		});
		return [...folders, ...files];
	} else {
		return errorMessage('not a directory: ', currentDirectory);
	}
};

export const description = 'list the contents of a directory, defaults to cwd.';
