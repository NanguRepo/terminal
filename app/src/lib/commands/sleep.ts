import { nothing } from '$lib/constants';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default async (input: string[]) => {
	await delay(input[0] * 1000);
	return nothing;
};

export const description = 'wait an amount of seconds';
