import { modules } from '../components/functions';
import type { terminalLine } from '../components/functions';

export default () => {
	const helpText: terminalLine = [{ text: '', style: '' }];
	const longest = Object.keys(modules).reduce((a, b) => {
		return a.length > b.length ? a : b;
	});
	for (const path in modules) {
		if (!path.includes('aliases/')) {
			helpText.push({
				text: "\n" + path.replace('../commands/', '').replace('.ts', ''),
				style: 'font-weight: bold; font-style: italic; text-decoration-line: underline; text-decoration-thickness: 2px;'
			});
			helpText.push({
				text: ' '.repeat(longest.length - path.length - 10),
				style:
					'text-decoration-line: underline; border-right-width: 1px; text-decoration-thickness: 2px;'
			});
			helpText.push({
				text: ' ' + modules[path].description,
				style:
					'color: cyan; text-decoration-line: underline; text-decoration-thickness: 2px;'
			});
		}
	}
	return helpText;
};
export const description = 'show this help page.';
