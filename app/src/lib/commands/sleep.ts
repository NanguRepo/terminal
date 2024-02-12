import { nothing } from '$lib/constants';
import { errorMessage } from '$lib/functions';
import { interrupted } from '$lib/stores';
import { get } from 'svelte/store';

export default async (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument: ', 'please provide an amount of time in seconds');
	}
	if (!Number(input[0])) {
		return errorMessage('invalid argument: ', `${input[0]} is not a number`);
	}

	let i = 0;
	await new Promise<void>((resolve) => {
		const intervalId = setInterval(() => {
			i += 100;
			if (i >= parseFloat(input[0]) * 1000 || get(interrupted)) {
				clearInterval(intervalId);
				interrupted.set(false);
				resolve();
			}
		}, 100);
	});

	return nothing;
};

export const description = 'wait an amount of seconds';
