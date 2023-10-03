import { createFile } from "../components/filesystem";
import { cwd } from "../components/stores";
import { get } from "svelte/store";

export default (input: string[]) => {
    createFile(get(cwd) + "/" + input[0], "")
    return [{text: `file created: ${input[0]}`, style: ''}]
}

export const description = "create a file in a location."