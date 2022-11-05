import { IWorkLinkDto } from '@/dto/ILinkDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { WordCategory } from '@/models/translations/WordCategory';

export interface ITranslationDto
	extends IEntryWithEntryType<EntryType.Translation> {
	id: number;
	createdAt: string;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks?: IWebLinkDto[];
	workLinks?: IWorkLinkDto[];
}
