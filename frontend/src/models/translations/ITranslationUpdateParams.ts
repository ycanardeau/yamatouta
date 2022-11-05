import { IWebLinkUpdateParams } from '@/models/IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '@/models/IWorkLinkUpdateParams';
import { WordCategory } from '@/models/translations/WordCategory';

export interface ITranslationUpdateParams {
	id: number;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
