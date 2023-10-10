import { readFile, resolvePath } from "../components/filesystem";
import { errorMessage } from "../components/functions";
import { get } from "svelte/store";
import { cwd } from "../components/stores";

export default (input: string[]) => {
    if (!input[0]) { return errorMessage('no argument: ', 'pathname required') }
    const path = resolvePath(get(cwd) + "/" + input[0])
    const fileContent = readFile(path)
    if (fileContent !== null) {
        return [
            {
                text: fileContent,
                style: ''
            }
        ]
    }
    return errorMessage("file not found: ", path)
}
export const description = "print the contents of a file."