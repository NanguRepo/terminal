import { terminalLines } from "../components/stores";

export default (input: string[]) => {
    terminalLines.set([])
    return "";
}
export const description = "clears the terminal."