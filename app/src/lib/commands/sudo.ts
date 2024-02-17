import { controller } from '$lib/functions';

export default (input: string[]) => {
	return controller(input.join(' '), true);
};
export const description =
	'force the execution of a command – only use this if you know what you are doing!';
