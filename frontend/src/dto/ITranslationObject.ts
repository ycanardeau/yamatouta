import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';
import { WordCategory } from '../models/translations/WordCategory';
import { IHashtagLinkObject } from './IHashtagLinkObject';
import { IWorkLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface ITranslationObject
	extends IEntryWithEntryType<EntryType.Translation> {
	id: number;
	createdAt: string;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	hashtagLinks?: IHashtagLinkObject[];
	webLinks?: IWebLinkObject[];
	workLinks?: IWorkLinkObject[];
}
