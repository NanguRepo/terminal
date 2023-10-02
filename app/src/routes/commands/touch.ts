import { createFile } from "../components/filesystem";

export default (input: string[]) => {
    createFile(input[0], "")
}