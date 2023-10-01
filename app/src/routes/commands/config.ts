import { get } from 'svelte/store'
import { config } from '../components/stores'

const helpString = "Usage: config <option> <value>\n\n" + JSON.stringify(get(config), null, "\t") + "\n"

export default (input: string[]) => {
    if (!input[0] || !(input[0] in get(config))) { return helpString }
    if (!input[1]) { return get(config)[input[0]] }
}
export const description = "configure the terminal."