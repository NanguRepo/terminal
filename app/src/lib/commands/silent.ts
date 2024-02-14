import { controller } from '$lib/functions';
import { nothing } from '$lib/constants';

export default (input: string[]) => {
	controller(input.join(' '));
	return nothing;
};

export const description = 'run a command without output';
