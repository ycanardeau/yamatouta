import { WordCategory } from '../../models/WordCategory';

export interface ITranslationObject {
	id: number;
	createdAt: string;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
}
