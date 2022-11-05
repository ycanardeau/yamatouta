import { IWorkLinkObject } from '@/dto/ILinkObject';
import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { WordCategory } from '@/models/translations/WordCategory';

export interface ITranslationObject
	extends IEntryWithEntryType<EntryType.Translation> {
	id: number;
	createdAt: string;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks?: IWebLinkObject[];
	workLinks?: IWorkLinkObject[];
}
