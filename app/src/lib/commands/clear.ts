import { terminalLines } from '$lib/stores';
import { nothing } from '$lib/constants';

export default () => {
	terminalLines.set([[{}]]);
	return nothing;
};
export const description = 'clears the terminal';
