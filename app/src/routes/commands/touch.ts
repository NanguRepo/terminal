import { createFile } from "../components/filesystem";
import { errorMessage } from "../components/functions";
import { cwd } from "../components/stores";
import { get } from "svelte/store";

export default (input: string[]) => {
    if (!input[0]) { return errorMessage('no argument: ', 'pathname required') }
    createFile(get(cwd) + "/" + input[0], "")
    return [{text: `file created: ${input[0]}`, style: ''}]
}

export const description = "create a file in a location."