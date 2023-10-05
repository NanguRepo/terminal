import { readFile } from "../components/filesystem";
import { errorMessage } from "../components/functions";
import { get } from "svelte/store";
import { cwd } from "../components/stores";

export default (input: string[]) => {
    const path = get(cwd) + "/" + input[0]
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