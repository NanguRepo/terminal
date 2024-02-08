import { fileSystem, cwd } from '$lib/stores';
import { get } from 'svelte/store';

export const createFile = (path: string, contents: string) => {
	const folders: string[] = path.split('/').slice(0, -1).reverse();
	const file: string = path.split('/').slice(-1)[0];
	fileSystem.set(
		deepMerge(get(fileSystem), createNestedObject(folders.length, file, contents, folders))
	);
};

export const createDirectory = (path: string) => {
	const folders: string[] = path.split('/').slice(0, -1).reverse();
	const file: string = path.split('/').slice(-1)[0];
	fileSystem.set(deepMerge(get(fileSystem), createNestedObject(folders.length, file, {}, folders)));
};

const traverse = (path: string) => {
	const pathElements = path.split('/').filter((element) => element !== ''); // Split and remove empty elements
	let currentObject = get(fileSystem);

	// Traverse the filesystem based on the path in filePath
	for (const element of pathElements) {
		currentObject = currentObject[element];

		if (!currentObject && currentObject !== '') {
			return false; // Directory or file not found
		}
	}
	return currentObject;
};

export const fileExists = (path: string) => {
	const currentObject = traverse(path);
	return currentObject !== undefined && currentObject !== false && !isObject(currentObject);
};

export const deleteFile = (path: string) => {
	const currentObject = traverse(path.split('/').slice(0, -1).join('/'));
	if (!currentObject || !currentObject[path.split('/').slice(-1)[0]]) {
		return null;
	}
	delete currentObject[path.split('/').slice(-1)[0]];
	return true;
};

export const directoryExists = (path: string) => {
	const currentObject = traverse(path);
	return currentObject !== undefined && currentObject !== false && isObject(currentObject);
};

export const readFile = (path: string): string | null | undefined => {
	if (!fileExists(path)) {
		return null;
	}
	const pathElements = path.split('/').filter((element) => element !== ''); // Split and remove empty elements
	let currentObject = get(fileSystem);

	for (const element of pathElements) {
		currentObject = currentObject[element];
	}
	// Check if the final element in the path exists and is not an object (indicating a file)
	if (currentObject !== undefined && !isObject(currentObject)) {
		return currentObject.toString();
	}
};

export const resolvePath = (targetPath: string) => {
	const currentPathElements = get(cwd)
		.split('/')
		.filter((element) => element !== ''); // Split and remove empty elements
	const targetPathElements = targetPath.split('/');

	// Process '..' in the target path
	const resolvedPathElements = [];
	for (const element of targetPathElements) {
		if (element === '~') {
			// Handle '~' segment as root/~
			resolvedPathElements.length = 0; // Clear existing elements
			resolvedPathElements.push('root', '~');
		} else if (element === '..') {
			// Move up one level by removing the last element
			if (resolvedPathElements.length > 1) {
				resolvedPathElements.pop();
			}
		} else if (element !== '.') {
			// Ignore '.' segments
			resolvedPathElements.push(element);
		}
	}
	return resolvedPathElements.join('/');
};

type fileSystemFolder = {
	[Key: string]: string | fileSystemFolder | Record<PropertyKey, never>;
};

const createNestedObject = (
	depth: number,
	file: string,
	contents: string | Record<PropertyKey, never>,
	folders: string[]
): fileSystemFolder => {
	if (depth === 0) {
		return { [file]: contents };
	}
	const folder = folders[depth - 1];
	// console.log({ [folder]: createNestedObject(depth - 1, file, contents, folders) });
	return { [folder]: createNestedObject(depth - 1, file, contents, folders) };
};

const deepMerge = (target: fileSystemFolder, source: fileSystemFolder) => {
	for (const key in source) {
		if (isObject(source[key])) {
			if (!target[key]) {
				Object.assign(target, { [key]: {} });
			}
			deepMerge(target[key], source[key]);
		} else {
			Object.assign(target, { [key]: source[key] });
		}
	}
	return target;
};

export const isObject = (item: string | fileSystemFolder) => {
	return item && typeof item === 'object' && !Array.isArray(item);
};
