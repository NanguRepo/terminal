import { fileSystem } from './stores';
import { get } from 'svelte/store';

export const createFile = (path: string, contents: string) => {
	const folders: string[] = path.split('/').slice(0, -1).reverse();
	const file: string = path.split('/').slice(-1)[0];
	fileSystem.set(
		deepMerge(get(fileSystem), createNestedObject(folders.length, file, contents, folders))
	);
	console.log(get(fileSystem));
};

type fileSystemFolder = {
	[Key: string]: string | fileSystemFolder;
};

const createNestedObject = (
	depth: number,
	file: string,
	contents: string,
	folders: string[]
): fileSystemFolder => {
	if (depth === 0) {
		return { [file]: contents };
	}
	const folder = folders[depth - 1];
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

export const isObject = (item: string|fileSystemFolder) => {
	return item && typeof item === 'object' && !Array.isArray(item);
}