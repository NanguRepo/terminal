import { get } from 'svelte/store';
import { terminalLines } from './stores';
import { echo } from '../commands/echo'

interface commandObject {
    [key:string]: (input: string[]) => string
}

const commands: commandObject = {
    "echo": echo
}

export const print = (text: string) => {
	terminalLines.set([text, ...get(terminalLines)]);
};
export const controller = (input: string[]) => {
    if (input[0] in commands) {
        return commands[input[0]](input.slice(1))
    }
    return `Command ${input[0]} does not exist.`
}