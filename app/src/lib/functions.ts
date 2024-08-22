import { get } from 'svelte/store';
import { terminalLines, log, processing, replacePrevious, cwd, printingBlocked } from '$lib/stores';
import { readFile, createFile, directoryExists, resolvePath } from '$lib/filesystem';
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
	if (get(printingBlocked)) {
		return;
	}
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

function splitArrayBetweenDelimiters(
	arr: string[],
	startDelimiter: string,
	endDelimiter: string
): [string[][], number[][]] {
	const result: string[][] = [];
	const indices: number[][] = [];
	let currentSection: string[] = [];
	let currentIndexPair: number[] = [];
	let currentIndex: number = 0;
	let sectionStarted = false;

	for (const item of arr) {
		if (item === startDelimiter && !sectionStarted) {
			currentIndexPair.push(currentIndex);
			sectionStarted = true; // Start a new section
		} else if (item === endDelimiter && sectionStarted) {
			if (currentSection.length > 0) {
				result.push(currentSection); // Add the completed section to the result
			}
			currentSection = []; // Reset the current section for the next iteration
			currentIndexPair.push(currentIndex);
			indices.push(currentIndexPair);
			currentIndexPair = [];
			sectionStarted = false;
		} else if (sectionStarted) {
			currentSection.push(item); // Add items to the current section
		}
		currentIndex++;
	}

	return [result, indices];
}

// use vite glob import to get every command within the folder
export const modules = import.meta.glob('$lib/commands/*.ts', { eager: true });

// restructure the input string to an ordered array of token objects, each object having a type and some content

// interface tokenType [string, object]

interface commandToken {
	type:
		| 'semicolon'
		| 'pipe'
		| 'redirection'
		| 'inputRedirection'
		| 'subshell'
		| 'command'
		| 'file'
		| undefined;
	before?: commandToken;
	after?: commandToken;
	value?: string | string[];
}

const getDeepToken = (token: commandToken, depth: number) => {
	let deepToken = token;
	[...Array(depth)].map(() => (deepToken = deepToken.before || deepToken));
	return deepToken;
};

const formatInput = (input: string): commandToken => {
	let token: commandToken = { type: undefined };
	let currentToken = '';
	let previousChar = '';
	let tokenStack: string[] = [];
	let insideQuotes = false;
	let escaped = false;
	let testingInput = 'fetch < url\\ file.txt';
	let inputCharacters = testingInput.split('').reverse();
	let depth = 0;
	for (const char of inputCharacters) {
		let deepToken = getDeepToken(token, depth);
		if (char === ';') {
			deepToken.type = 'semicolon';
			deepToken.after = { type: 'command', value: tokenStack };
			deepToken.before = { type: undefined };
			depth++;
			tokenStack = [];
		} else if (char === '|') {
			deepToken.type = 'pipe';
			deepToken.after = { type: 'command', value: tokenStack };
			deepToken.before = { type: undefined };
			depth++;
			tokenStack = [];
		} else if (char === '>') {
			if (previousChar === '>') {
				deepToken = getDeepToken(token, depth - 1);
				deepToken.value = ['append'];
			} else {
				deepToken.value = ['write'];
			}
			deepToken.type = 'redirection';
			deepToken.after = { type: 'file', value: tokenStack };
			deepToken.before = { type: undefined };
			depth++;
			tokenStack = [];
		} else if (char === '<') {
			deepToken.type = 'inputRedirection';
			deepToken.after = { type: 'file', value: tokenStack };
			deepToken.before = { type: undefined };
			depth++;
			tokenStack = [];
		} else if (char === ' ' && !insideQuotes && !escaped) {
			if (currentToken !== '') {
				tokenStack = [currentToken, ...tokenStack];
			}
			currentToken = '';
		} else if (char === '"') {
			insideQuotes = !insideQuotes;
		} else if (char === '\\') {
			escaped = true;
		} else if (char) {
			currentToken = char + currentToken;
		}
		previousChar = char;
		console.log(currentToken);
	}

	if (tokenStack) {
		if (currentToken) {
			tokenStack = [currentToken, ...tokenStack];
		}
		let deepToken = getDeepToken(token, depth);
		deepToken.type = 'command';
		deepToken.value = tokenStack;
	}

	return token;
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
	printingBlocked.set(true);
	const response = await handleSyntax(tokens[0], false);
	let responseString: string = '';
	for (const part of response) {
		responseString = responseString + part.text;
	}
	if (delimiter === '>>') {
		let fileContents = readFile(targetFile) || '';
		responseString = fileContents + '\n' + responseString;
	}
	createFile(targetFile, responseString);
	printingBlocked.set(false);
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

const handleSubshellCommand = async (input: string[]) => {
	const [commands, indices] = splitArrayBetweenDelimiters(input, '$', '$');
	console.log(input, commands, indices);
	const response = await handleSyntax(commands[0], false);
	const firstHalf = input.slice(0, indices[0][0]);
	let middle: string = '';
	for (const part of response) {
		middle = middle + (part.text || '');
	}
	if (input.slice(indices[0][1] + 1)[0] === '"') {
	}
	const secondHalf = [middle, ...input.slice(indices[0][1] + 1)];
	console.log(firstHalf, secondHalf);
	console.log(middle);

	return handleSyntax(firstHalf.concat(secondHalf), false);
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
	if (input.includes('$')) {
		return await handleSubshellCommand(input);
	}
	for (const [index, token] of input.entries()) {
		if (token.startsWith('"') && token.endsWith('"')) {
			input[index] = token.substring(1, token.length - 1);
		}
	}
	return await executeCommand(input, sudo);
};

export const controller = async (
	inputString: string,
	sudo: boolean = false
): Promise<terminalLine> => {
	if (!inputString) {
		return nothing;
	}
	const input = formatInput(inputString);
	console.log(input);
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
