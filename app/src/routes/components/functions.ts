import { get } from 'svelte/store';
import { terminalLines, log } from './stores';

export const logCommand = (command: string) => {
    log.set([...get(log), command])
}

export const print = (text: string) => {
	terminalLines.set([text, ...get(terminalLines)]);
};

// use vite glob import to get every command within the folder
const modules = import.meta.glob('../commands/*.ts', {eager: true});
export const controller = (input: string[]) => {
    if (input[0] == '') {
        return ''
    }
    if (`../commands/${input[0]}.ts` in modules) {
        return modules[`../commands/${input[0]}.ts`]?.default(input.slice(1))
    }
    return `Command ${input[0]} does not exist.`
}
export const generateHelpText = () => {
    let helpText: string = ""
    for (const path in modules) {
        helpText += `${path.replace('../commands/', '').replace('.ts', '')}: ${modules[path].description}\n`
    }
    return helpText;
}