import axios from 'axios';
import { fileSystem } from '$lib/stores';
import { get } from 'svelte/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const startTime = dayjs();
dayjs.extend(relativeTime);
const headerStyle = 'font-weight: 600';

export default async () => {
	const version = await axios.get('https://api.github.com/repos/nangurepo/terminal/commits/master');
	return [
		{ text: 'Terminal, a ', style: 'font-size: 24px' },
		{
			text: 'pege.io',
			style: 'font-size: 24px',
			url: 'https://pege.io'
		},
		{ text: ' project\n', style: 'font-size: 24px' },
		{ text: 'Version: ', style: headerStyle },
		{
			text: version.data.sha.substring(0, 7) + '\n',
			url: 'https://github.com/NanguRepo/terminal/commit/' + version.data.sha
		},
		{ text: 'Last updated: ', style: headerStyle },
		{ text: dayjs(version.data.commit.author.date).from(dayjs()) + '\n' },
		{
			text: 'Filesystem size: ',
			style: headerStyle
		},
		{ text: (JSON.stringify(get(fileSystem)).length / 1000).toFixed(2) + ' kB\n' },
		{ text: 'Uptime: ', style: headerStyle },
		{ text: startTime.from(dayjs(), true) }
	];
};

export const description = 'get info about the terminal';
