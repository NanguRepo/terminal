import { createFile } from "../components/filesystem";
import { cwd } from "../components/stores";
import { get } from "svelte/store";

export default (input: string[]) => {
    createFile(get(cwd) + "/" + input[0], "")
    return `file created: ${input[0]}`
}

export const description = "create a file in a location."