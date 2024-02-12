import axios from 'axios';
import { fileSystem, replacePrevious } from '$lib/stores';
import { get } from 'svelte/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { print, type terminalLine } from '$lib/functions';

const startTime = dayjs();
dayjs.extend(relativeTime);
const headerStyle = 'font-weight: 600';

const createInfoPage = (sections: Record<string, any>): terminalLine => {
	let returnLine = [
		{ text: 'Terminal, a ', style: 'font-size: 24px' },
		{
			text: 'pege.io',
			style: 'font-size: 24px',
			url: 'https://pege.io'
		},
		{ text: ' project\n', style: 'font-size: 24px' }
	];
	for (const section of Object.keys(sections)) {
		returnLine.push({ text: section, style: headerStyle });
		returnLine.push(sections[section]);
	}
	return returnLine;
};

export default async () => {
	let infoPageObject: Record<string, any> = {
		'Version: ': { text: 'Fetching...\n' },
		'Last updated: ': { text: 'Fetching...\n' },
		'Filesystem size: ': {
			text: (JSON.stringify(get(fileSystem)).length / 1000).toFixed(2) + ' kB\n'
		},
		'Uptime: ': { text: startTime.from(dayjs(), true) }
	};
	print(createInfoPage(infoPageObject));
	replacePrevious.set(true);
	const version = await axios.get('https://api.github.com/repos/nangurepo/terminal/commits/master');
	infoPageObject['Version: '] = {
		text: version.data.sha.substring(0, 7) + '\n',
		url: 'https://github.com/NanguRepo/terminal/commit/' + version.data.sha
	};
	infoPageObject['Last updated: '] = {
		text: dayjs(version.data.commit.author.date).from(dayjs()) + '\n'
	};
	return createInfoPage(infoPageObject);
};

export const description = 'get info about the terminal';
