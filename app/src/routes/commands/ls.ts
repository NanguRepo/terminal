import { fileSystem, cwd } from "../components/stores";
import { get } from "svelte/store";

export default (input: string[]) => {
    return Object.keys(get(fileSystem[get(cwd)]))
}