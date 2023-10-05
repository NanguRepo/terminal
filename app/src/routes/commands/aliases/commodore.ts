import config from '../config';

export default () => {
	config(['backgroundcolor', '#483AAA']);
	config(['containercolor', '#867ADE']);
	config(['textcolor', '#867ADE']);
	config(['customcss', 'font-family: c64; text-transform: uppercase; border-radius: 0px;']);
	config(['prompt', ' ']);
	return [{ text: 'POKE 53280,14\nPOKE 53281,6\nPOKE 646,14\nREADY.' }];
};
