import { fileSystem } from "../components/stores";
import { get } from "svelte/store";

export default () => {
    localStorage.setItem('filesystem', JSON.stringify(get(fileSystem)))
    return [{text: "filesystem saved"}]
}
export const description = "save the current state of the filesystem to your browser's local storage."