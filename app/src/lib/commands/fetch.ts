import axios from 'axios';
import { errorMessage, print } from '$lib/functions';
import { interrupted } from '$lib/stores';

const isIP = (address: string) => {
	return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
		address
	);
};

export default async (input: string[]) => {
	const controller = new AbortController();
	interrupted.subscribe((value) => {
		if (value) {
			controller.abort();
			interrupted.set(false);
		}
	});
	if (!input[0]) {
		return errorMessage('no argument', 'url required');
	}
	if (!(input[0].startsWith('http://') || input[0].startsWith('https://') || isIP(input[0]))) {
		input[0] = 'https://' + input[0];
	}
	print([{ text: `Fetching ${input[0]}...`, style: 'font-weight: 800;' }]);

	try {
		const response = await axios.get(input[0], { signal: controller.signal });
		return [{ text: JSON.stringify(response.data) }];
	} catch (error: any) {
		return errorMessage('failed to fetch', error.message);
	}
};

export const description = 'fetch data from a url';
