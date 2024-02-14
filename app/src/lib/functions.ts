import { get } from 'svelte/store';
import { terminalLines, log, processing, replacePrevious } from '$lib/stores';
import { readFile } from '$lib/filesystem';
import { nothing } from '$lib/constants';

export const logCommand = (command: string) => {
	log.set([...get(log), command]);
};

export type terminalLine = {
	text?: string;
	style?: string;
	url?: string;
}[];

export const print = (input: terminalLine) => {
	if (get(replacePrevious)) {
		const terminalLinesShifted = get(terminalLines).slice(1);
		terminalLines.set(terminalLinesShifted);
		replacePrevious.set(false);
	}
	terminalLines.set([input, ...get(terminalLines)]);
};

function splitArrayByDelimiter(arr: string[], delimiter: string): string[][] {
	return arr.reduce(
		(result: string[][], current: string) => {
			if (current === delimiter) {
				result.push([]);
			} else {
				result[result.length - 1].push(current);
			}
			return result;
		},
		[[]]
	);
}

// use vite glob import to get every command within the folder
export const modules = import.meta.glob('$lib/commands/*.ts', { eager: true });

const formatInput = (input: string): string[] => {
	const tokens: string[] = [];
	let currentToken = '';
	let insideQuotes = false;

	for (let i = 0; i < input.length; i++) {
		const char = input[i];
		if (char === ' ' && !insideQuotes) {
			if (currentToken !== '') {
				tokens.push(currentToken);
				currentToken = '';
			}
		} else if (char === '"') {
			insideQuotes = !insideQuotes;
			// currentToken += char;
		} else if (char === ';' && !insideQuotes) {
			if (currentToken !== '') {
				tokens.push(currentToken);
				currentToken = '';
			}
			tokens.push(char);
		} else {
			currentToken += char;
		}
	}

	if (currentToken !== '') {
		tokens.push(currentToken);
	}

	return tokens;
};

const handlePipe = async (input: any[]) => {
	let currentOutput: string = '';
	let response: terminalLine = [];
	for (const token of splitArrayByDelimiter(input, '|')) {
		response = await executeCommand(token.concat(formatInput(currentOutput)), false);
		currentOutput = '';
		for (const part of response) {
			currentOutput = currentOutput + part.text;
		}
	}
	return response;
};

export const controller = async (
	inputString: string,
	sudo: boolean = false
): Promise<terminalLine> => {
	if (inputString == '') {
		return nothing;
	}
	const input = formatInput(inputString);
	if (input.includes(';')) {
		for (let command of splitArrayByDelimiter(input, ';')) {
			print(await controller(command.join(' ')));
		}
		return nothing;
	}
	if (input.includes('|')) {
		return handlePipe(input);
	}
	return await executeCommand(input, sudo);
};

const executeCommand = async (input: string[], sudo: boolean): Promise<terminalLine> => {
	const commandName: string = getAlias(input[0].toLowerCase());
	if (`/src/lib/commands/${commandName}.ts` in modules) {
		processing.set(true);
		let response = await modules[`/src/lib/commands/${commandName}.ts`]?.default(
			input.slice(1),
			sudo
		);
		processing.set(false);
		return response;
	}
	return errorMessage('command not found: ', input[0]);
};

const getAlias = (input: string) => {
	const aliases = readFile('root/~/.aliases');
	if (aliases) {
		for (const line of aliases.split('\n')) {
			if (input == line.split('=')[0]) {
				return line.split('=')[1];
			}
		}
	}
	return input;
};

export const errorMessage = (message: string, detail?: string) => {
	return [
		{
			text: 'Error: ',
			style: 'color: #FF6666; font-weight: bold'
		},
		{
			text: message,
			style: 'color: #FFAAAA;'
		},
		{
			text: detail || ''
		}
	];
};
