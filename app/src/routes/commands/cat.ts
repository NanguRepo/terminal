import { readFile } from "../components/filesystem";
import { get } from "svelte/store";
import { cwd } from "../components/stores";

export default (input: string[]) => {
    return readFile(get(cwd) + "/" + input[0])
}