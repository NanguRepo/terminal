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
				text: path.replace('../commands/', '').replace('.ts', ''),
				style: 'font-weight: bold; text-decoration-line: underline; text-underline-offset: 0.5ch'
			});
			helpText.push({
				text: ' '.repeat(longest.length - path.length - 10),
				style:
					'text-decoration-line: underline; text-underline-offset: 0.5ch; border-right-width: 1px;'
			});
			helpText.push({
				text: ' ' + modules[path].description + '\n',
				style: 'color: cyan; text-decoration-line: underline; text-underline-offset: 0.5ch'
			});
		}
	}
	return helpText;
};
export const description = 'show this help page.';
