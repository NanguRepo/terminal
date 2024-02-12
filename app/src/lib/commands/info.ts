import axios from 'axios';
import { fileSystem } from '$lib/stores';
import { get } from 'svelte/store';

export default async (input: string[]) => {
	const version = await axios.get('https://api.github.com/repos/nangurepo/terminal/commits/master');
	return [
		{ text: 'Terminal\n', style: 'font-size: 24px' },
		{ text: 'Version: ', style: 'font-weight: 600' },
		{
			text: version.data.sha.substring(0, 7) + '\n',
			url: 'https://github.com/NanguRepo/terminal/commit/' + version.data.sha
		},
		{
			text: 'Filesystem size: ' + (JSON.stringify(get(fileSystem)).length / 1000).toFixed(2) + ' kB'
		}
	];
};

export const description = 'get info about the terminal';
