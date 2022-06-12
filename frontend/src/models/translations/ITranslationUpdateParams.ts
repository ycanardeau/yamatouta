import { IHashtagUpdateParams } from '../IHashtagUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '../IWorkLinkUpdateParams';
import { WordCategory } from './WordCategory';

export interface ITranslationUpdateParams {
	id: number;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	hashtags: IHashtagUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
