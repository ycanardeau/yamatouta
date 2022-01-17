import { escapeWildcardCharacters } from '../../src/utils/escapeWildcardCharacters';

test('escapeWildcardCharacters', () => {
	expect(escapeWildcardCharacters('%%大__和__言__葉%%')).toBe(
		'\\%\\%大\\_\\_和\\_\\_言\\_\\_葉\\%\\%',
	);
});
