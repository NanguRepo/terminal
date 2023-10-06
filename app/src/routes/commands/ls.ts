import { fileSystem, cwd } from '../components/stores';
import type { fileSystemFolder } from '../components/stores';
import { isObject, resolvePath } from '../components/filesystem';
import { get } from 'svelte/store';
import { errorMessage } from '../components/functions';

export default (input: string[]) => {
	let directory = get(cwd);
	if (input[0]) {
		directory += `/${input[0]}`;
	}
	const response = ls(resolvePath(directory), get(fileSystem));
	if (typeof response == 'string') {
		return [{ text: response }]
	} else {
		return errorMessage(response[0], response[1])
	}
};

const ls = (currentDirectory: string, filesystem: fileSystemFolder) => {
	const pathElements = currentDirectory.split('/').filter((element) => element !== ''); // Split and remove empty elements
	let currentObject = filesystem;

	// Traverse the filesystem based on the path in the currentDirectory
	for (const element of pathElements) {
		currentObject = currentObject[element];
		if (!currentObject && currentObject !== "") {
			return ['directory not found: ', element];
		}
	}

	if (isObject(currentObject)) {
		const contents = Object.keys(currentObject);
		let returnMessage: string = '';
		for (const item of contents) {
			if (isObject(currentObject[item])) {
				returnMessage += item + '/\t';
			} else {
				returnMessage += item + '\t';
			}
		}
		return returnMessage;
	} else {
		return ['not a directory: ', currentDirectory];
	}
};

export const description = 'list the contents of a directory, defaults to cwd.';
