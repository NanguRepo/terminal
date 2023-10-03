import { cwd } from "../components/stores";
import { get } from "svelte/store";
import { createFile, readFile } from "../components/filesystem";

export default (input: string[]) => {
    const path = get(cwd) + '/' + input[0];
    let content: string;
    let preexistingText: string = ""
    const fileContent = readFile(path)
    if (fileContent) {
        preexistingText = fileContent
    }
    const promptResult = prompt("File content", preexistingText);
    if (promptResult == null) {
        content = ""
    } else {
        content = promptResult
    }
    createFile(path, content)
    return [{text: `file created: ${input[0]}\nwith content: ${content}`, style: ''}];
}

export const description = "edit the contents of a file or create a new file with content."