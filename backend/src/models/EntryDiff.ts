import { ChangeLogChangeKey } from './ChangeLogChangeKey';

export type TranslationDiff = Record<
	| ChangeLogChangeKey.Translation_Headword
	| ChangeLogChangeKey.Translation_Locale
	| ChangeLogChangeKey.Translation_Reading
	| ChangeLogChangeKey.Translation_Yamatokotoba
	| ChangeLogChangeKey.Translation_Category,
	string | undefined
>;

export type EntryDiff = TranslationDiff;
