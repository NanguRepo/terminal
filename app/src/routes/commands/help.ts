import { modules } from '../components/functions';
import type { terminalLine } from '../components/functions';

export default () => {
	const helpText: terminalLine = [{ text: '', style: '' }];
	const longest = Object.keys(modules).reduce((a, b) => {
		return a.length > b.length ? a : b;
	});
	for (const path in modules) {
		helpText.push({
			text: '\n' + path.replace('../commands/', '').replace('.ts', ''),
			style:
				'font-weight: bold; font-style: italic'
		});
		helpText.push({
			text: ' '.repeat(longest.length - path.length + 3)
		});
		helpText.push({
			text: modules[path].description,
			style:
				'color: cyan'
		});
	}
	return helpText;
};
export const description = 'show this help page.';
