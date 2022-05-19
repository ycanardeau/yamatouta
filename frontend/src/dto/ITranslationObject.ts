import { WordCategory } from '../models/translations/WordCategory';
import { IWorkLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface ITranslationObject {
	id: number;
	createdAt: string;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks: IWebLinkObject[];
	workLinks: IWorkLinkObject[];
}
