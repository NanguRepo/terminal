import { get } from 'svelte/store';
import { config, configDefaults } from '$lib/stores';

const isErroneous = (input: string[]) => {
	return (
		!input[0] || (!(input[0] in get(config)) && input[0] != '*') || (input[0] == '*' && !input[1])
	);
};

const reset = (input: string[]) => {
	if (input[0] == '*') {
		config.set(configDefaults);
		return 'Reset config to defaults';
	}
	config.set({ ...get(config), [input[0]]: configDefaults[input[0]] });
	return `Reset ${input[0]} to ${configDefaults[input[0]]}`;
};

const setAll = (value: string) => {
	for (const key of Object.keys(get(config))) {
		config.set({ ...get(config), [key]: value });
	}
	return `Set all values to ${value}`;
};

export default (input: string[]) => {
	if (isErroneous(input)) {
		return [
			{
				text: 'Usage: config <option> <value>\n\n' + JSON.stringify(get(config), null, '\t') + '\n',
				style: ''
			}
		];
	}
	if (!input[1]) {
		return [{ text: get(config)[input[0]], style: '' }];
	}
	input[1] = input.slice(1).join(' ');
	if (input[1] == 'reset') {
		return [{ text: reset(input), style: '' }];
	}
	if (input[0] == '*') {
		return [{ text: setAll(input[1]), style: '' }];
	}
	config.set({ ...get(config), [input[0]]: input[1] });
	return [{ text: `Set ${input[0]} to ${input[1]}`, style: '' }];
};
export const description = 'configure the terminal.';
