// Escapes wildcard characters (% and _).
// See: https://github.com/knex/knex/issues/648.
export const escapeWildcardCharacters = (text: string): string => {
	return text.replaceAll('%', '\\%').replaceAll('_', '\\_');
};
