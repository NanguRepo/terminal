import { terminalLines } from '../components/stores';

export default () => {
	terminalLines.set([]);
	return [{text: '', style: 'display: none;'}];
};
export const description = 'clears the terminal';