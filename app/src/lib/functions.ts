import { get } from 'svelte/store';
import { terminalLines, log, processing, replacePrevious, cwd } from '$lib/stores';
import { readFile, createFile, directoryExists, resolvePath, fileExists } from '$lib/filesystem';
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
		terminalLines.set(get(terminalLines).slice(1));
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

const handleSemicolon = async (input: string[]) => {
	for (let command of splitArrayByDelimiter(input, ';')) {
		print(await handleSyntax(command, false));
	}
	return nothing;
};

const handlePipe = async (input: string[]) => {
	let currentOutput: string = '';
	let response: terminalLine = [];
	for (const token of splitArrayByDelimiter(input, '|')) {
		response = await handleSyntax(token.concat(formatInput(currentOutput)), false);
		currentOutput = '';
		for (const part of response) {
			currentOutput = currentOutput + part.text;
		}
	}
	return response;
};

const handleRedirection = async (input: string[]) => {
	let delimiter = '>';
	if (input.includes('>>')) {
		delimiter = '>>';
	}
	const tokens = splitArrayByDelimiter(input, delimiter);
	if (tokens.length > 2) {
		return errorMessage(
			'invalid syntax',
			'you cannot have more than one redirection in a statement'
		);
	}
	const targetFile = resolvePath(get(cwd) + '/' + tokens[1][0]);
	if (directoryExists(targetFile)) {
		return errorMessage('invalid path', 'path points to a directory');
	}
	const response = await executeCommand(tokens[0], false);
	let responseString: string = '';
	for (const part of response) {
		responseString = responseString + part.text;
	}
	if (delimiter === '>>') {
		let fileContents = readFile(targetFile) || '';
		responseString = fileContents + '\n' + responseString;
	}
	createFile(targetFile, responseString);
	return nothing;
};

const handleInputRedirection = async (input: string[]) => {
	const tokens = splitArrayByDelimiter(input, '<');
	if (tokens.length > 2) {
		return errorMessage(
			'invalid syntax',
			'you cannot have more than one redirection in a statement'
		);
	}
	const fileContent = readFile(resolvePath(get(cwd) + '/' + tokens[1]));
	if (!fileContent) {
		return errorMessage('invalid path', 'file not found');
	}
	return await handleSyntax([...tokens[0], fileContent], false);
};

const handleSyntax = async (input: string[], sudo: boolean): Promise<terminalLine> => {
	if (input.includes(';')) {
		return await handleSemicolon(input);
	}
	if (input.includes('|')) {
		return await handlePipe(input);
	}
	if (input.includes('>') || input.includes('>>')) {
		return await handleRedirection(input);
	}
	if (input.includes('<')) {
		return await handleInputRedirection(input);
	}
	return await executeCommand(input, sudo);
};

export const controller = async (
	inputString: string,
	sudo: boolean = false
): Promise<terminalLine> => {
	if (inputString == '') {
		return nothing;
	}
	const input = formatInput(inputString);
	return await handleSyntax(input, sudo);
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
	return errorMessage('command not found', input[0]);
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
			text: message + (detail ? ': ' : ''),
			style: 'color: #FFAAAA;'
		},
		{
			text: detail || ''
		}
	];
};
