import { EntryType } from './EntryType';

export enum LinkType {
	Unspecified = 'Unspecified',
	//Artist_Artist_Member = 'Artist_Artist_Member',
	Quote_Work_Source = 'Quote_Work_Source',
	//Translation_Translation_Antonym = 'Translation_Translation_Antonym',
	//Translation_Translation_Synonym = 'Translation_Translation_Synonym',
	//Translation_Translation_Etymology = 'Translation_Translation_Etymology',
	Translation_Work_Source = 'Translation_Work_Source',
	Work_Artist_Author = 'Work_Artist_Author',
	Work_Artist_Contributor = 'Work_Artist_Contributor',
	Work_Artist_Editor = 'Work_Artist_Editor',
	Work_Artist_Foreword = 'Work_Artist_Foreword',
	Work_Artist_Publisher = 'Work_Artist_Publisher',
	Work_Artist_Translator = 'Work_Artist_Translator',
}

export const artistLinkTypes: Record<EntryType.Work, LinkType[]> = {
	//[EntryType.Artist]: [LinkType.Unspecified, LinkType.Artist_Artist_Member],
	[EntryType.Work]: [
		LinkType.Unspecified,
		LinkType.Work_Artist_Author,
		LinkType.Work_Artist_Contributor,
		LinkType.Work_Artist_Editor,
		LinkType.Work_Artist_Foreword,
		LinkType.Work_Artist_Publisher,
		LinkType.Work_Artist_Translator,
	],
};

export const workLinkTypes: Record<
	EntryType.Quote | EntryType.Translation,
	LinkType[]
> = {
	[EntryType.Quote]: [LinkType.Quote_Work_Source],
	[EntryType.Translation]: [LinkType.Translation_Work_Source],
};
