import { cwd } from '../components/stores';
import { errorMessage } from '../components/functions';
import { directoryExists, resolvePath } from '../components/filesystem';
import { get } from 'svelte/store';

export default (input: string[]) => {
	if (!input[0]) {
		return errorMessage('no input: ', 'pathname required');
	}
    const path = resolvePath(get(cwd) + "/" + input[0])
    if (!directoryExists(path)) {
        return errorMessage('directory not found: ', path)
    }
    cwd.set(path)
    return [{text: '', style: 'display: none;'}];
};
