import { terminalLines } from '../components/stores';

export default () => {
	terminalLines.set([]);
	return '';
};
export const description = 'clears the terminal';