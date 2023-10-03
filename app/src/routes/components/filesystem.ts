import { fileSystem } from './stores';
import { get } from 'svelte/store';

export const createFile = (path: string, contents: string) => {
	const folders: string[] = path.split('/').slice(0, -1).reverse();
	const file: string = path.split('/').slice(-1)[0];
	fileSystem.set(
		deepMerge(get(fileSystem), createNestedObject(folders.length, file, contents, folders))
	);
};

export const fileExists = (filePath: string) => {
    const pathElements = filePath.split('/').filter(element => element !== ''); // Split and remove empty elements
    let currentObject = get(fileSystem);

    // Traverse the filesystem based on the path in filePath
    for (const element of pathElements) {
        currentObject = currentObject[element];
        if (!currentObject) {
            return false; // Directory or file not found
        }
    }

    // Check if the final element in the path exists and is not an object (indicating a file)
    return currentObject !== undefined && !isObject(currentObject);
}

export const readFile = (filePath: string): string|null => {
    if (!fileExists(filePath)) { return null }
    const pathElements = filePath.split('/').filter(element => element !== ''); // Split and remove empty elements
    let currentObject = get(fileSystem);

    for (const element of pathElements) {
        currentObject = currentObject[element]
    }
    // Check if the final element in the path exists and is not an object (indicating a file)
    if (currentObject !== undefined && !isObject(currentObject)) {
        return currentObject.toString();
    } else {
        return null; // File not found
    }
}

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