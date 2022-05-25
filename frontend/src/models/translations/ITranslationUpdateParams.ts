import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { WordCategory } from './WordCategory';

export interface ITranslationUpdateParams {
	id: number;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks: IWebLinkUpdateParams[];
}
