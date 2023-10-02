import { get } from 'svelte/store';
import { terminalLines, log } from './stores';

export const logCommand = (command: string) => {
    log.set([...get(log), command])
}

export const print = (text: string) => {
	terminalLines.set([text, ...get(terminalLines)]);
};

// use vite glob import to get every command within the folder
const modules = import.meta.glob('../commands/**/*.ts', {eager: true});
export const controller = (input: string[]) => {
    if (input[0] == '') {
        return ''
    }
    const commandName: string = input[0].toLowerCase().replace('a/', 'aliases/')
    if (`../commands/${commandName}.ts` in modules) {
        return modules[`../commands/${commandName}.ts`]?.default(input.slice(1))
    }
    return 'command not found: ' + input[0];
}
export const generateHelpText = () => {
    let helpText: string = ""
    for (const path in modules) {
        if (!path.includes("aliases/")) {
            helpText += `${path.replace('../commands/', '').replace('.ts', '')}: ${modules[path].description}\n`
        }
    }
    return helpText;
}