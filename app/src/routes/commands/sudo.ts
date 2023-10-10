import { controller } from "../components/functions";

export default (input: string[]) => {
    return controller(input, true)
}
export const description = "force the execution of a command – only use this if you know what you are doing!"