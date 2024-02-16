import { errorMessage } from '$lib/functions';

export default (input: string[], sudo: boolean = false) => {
	if (sudo) {
		localStorage.clear();
		return [{ text: 'filesystem reset' }];
	}
	return errorMessage(
		'sudo required',
		're-run with sudo to confirm that you want to reset the entire file system permanently'
	);
};
export const description = 'reset the filesystem stored in local storage.';
