import { errorMessage } from '$lib/functions';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no input: ', 'string required');
	}
	if (!input[1]) {
		input[1] = '';
	}
	return [{ text: input[0], style: input[1] }];
};
export const description = 'print a string to the terminal.';
