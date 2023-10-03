import { fileSystem, cwd } from "../components/stores";
import type { fileSystemFolder } from "../components/stores";
import { isObject } from "../components/filesystem";
import { get } from "svelte/store";

export default (input: string[]) => {
    let directory = get(cwd)
    if (input[0]) {
        directory += `/${input[0]}`
    }
    return [{text: ls(directory, get(fileSystem)), style: ''}]
}

function ls(currentDirectory: string, filesystem: fileSystemFolder) {
	const pathElements = currentDirectory.split('/').filter((element) => element !== ''); // Split and remove empty elements
	let currentObject = filesystem;

	// Traverse the filesystem based on the path in the currentDirectory
	for (const element of pathElements) {
		currentObject = currentObject[element];
		if (!currentObject) {
			return `Directory '${element}' not found.`;
		}
	}

	if (isObject(currentObject)) {
		const contents = Object.keys(currentObject);
        let returnMessage: string = "";
		for (const item of contents) {
            if (isObject(currentObject[item])) {
                returnMessage += item + "/\t"
            } else {
				returnMessage += item + "\t";
			}
		}
        return returnMessage
	} else {
		return `${currentDirectory} is not a directory.`;
	}
}

export const description = "get the contents of a directory, defaults to cwd."