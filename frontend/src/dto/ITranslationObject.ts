import { WordCategory } from '../models/translations/WordCategory';
import { IWebLinkObject } from './IWebLinkObject';
import { IWorkLinkObject } from './IWorkLinkObject';

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
