import { EntryType } from './EntryType';

export enum LinkType {
	Work_Artist_Author = 'Work_Artist_Author',
	Work_Artist_Contributor = 'Work_Artist_Contributor',
	Work_Artist_Editor = 'Work_Artist_Editor',
	Work_Artist_Foreword = 'Work_Artist_Foreword',
	Work_Artist_Publisher = 'Work_Artist_Publisher',
	Work_Artist_Translator = 'Work_Artist_Translator',
}

export const artistLinkTypes: Record<EntryType.Work, LinkType[]> = {
	[EntryType.Work]: [
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
	[EntryType.Quote]: [],
	[EntryType.Translation]: [],
};
