export enum LinkType {
	Work_Artist_Author = 'Work_Artist_Author',
	Work_Artist_Contributor = 'Work_Artist_Contributor',
	Work_Artist_Editor = 'Work_Artist_Editor',
	Work_Artist_Foreword = 'Work_Artist_Foreword',
	Work_Artist_Publisher = 'Work_Artist_Publisher',
	Work_Artist_Translator = 'Work_Artist_Translator',
}

export const quoteWorkLinkTypes = [];

export const translationWorkLinkTypes = [];

export const workArtistLinkTypes = [
	LinkType.Work_Artist_Author,
	LinkType.Work_Artist_Contributor,
	LinkType.Work_Artist_Editor,
	LinkType.Work_Artist_Foreword,
	LinkType.Work_Artist_Publisher,
	LinkType.Work_Artist_Translator,
];
