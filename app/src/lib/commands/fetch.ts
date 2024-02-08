import axios from 'axios';
import { errorMessage, print } from '$lib/functions';

const isIP = (address: string) => {
	return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
		address
	);
};

export default async (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no argument: ', 'url required');
	}
	if (!(input[0].startsWith('http://') || input[0].startsWith('https://') || isIP(input[0]))) {
		input[0] = 'https://' + input[0];
	}
	print([{ text: `Fetching ${input[0]}...`, style: 'font-weight: 800;' }]);
	try {
		const response = await axios.get(input[0], { withCredentials: false });
		return [{ text: JSON.stringify(response.data) }];
	} catch (error) {
		return errorMessage('failed to fetch: ', error.message);
	}
};

export const description = 'fetch data from a url';
