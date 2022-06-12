import { IHashtagLinkUpdateParams } from '../IHashtagLinkUpdateParams';
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
	hashtagLinks: IHashtagLinkUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
