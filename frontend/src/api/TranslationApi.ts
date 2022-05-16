import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ITranslationObject } from '../dto/ITranslationObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { TranslationOptionalField } from '../models/TranslationOptionalField';
import { TranslationSortRule } from '../models/TranslationSortRule';
import { WordCategory } from '../models/WordCategory';
import { IPaginationParams } from '../stores/PaginationStore';

export const createTranslation = async ({
	headword,
	locale,
	reading,
	yamatokotoba,
	category,
	webLinks,
}: {
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks: IWebLinkObject[];
}): Promise<ITranslationObject> => {
	const response = await axios.post<ITranslationObject>('/translations', {
		headword,
		locale,
		reading,
		yamatokotoba,
		category,
		webLinks,
	});

	return response.data;
};

export const listTranslations = async ({
	pagination,
	sort,
	query,
	category,
}: {
	pagination: IPaginationParams;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}): Promise<ISearchResultObject<ITranslationObject>> => {
	const response = await axios.get<ISearchResultObject<ITranslationObject>>(
		'/translations',
		{
			params: {
				...pagination,
				sort: sort,
				query: query,
				category: category,
			},
		},
	);

	return response.data;
};

export const updateTranslation = async ({
	translationId,
	headword,
	locale,
	reading,
	yamatokotoba,
	category,
	webLinks,
}: {
	translationId: number;
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
	webLinks: IWebLinkObject[];
}): Promise<ITranslationObject> => {
	const response = await axios.patch<ITranslationObject>(
		`/translations/${translationId}`,
		{
			headword,
			locale,
			reading,
			yamatokotoba,
			category,
			webLinks,
		},
	);

	return response.data;
};

export const deleteTranslation = async ({
	translationId,
}: {
	translationId: number;
}): Promise<void> => {
	await axios.delete<void>(`/translations/${translationId}`);
};

export const getTranslation = async ({
	translationId,
	fields,
}: {
	translationId: number;
	fields?: TranslationOptionalField[];
}): Promise<ITranslationObject> => {
	const response = await axios.get<ITranslationObject>(
		`/translations/${translationId}`,
		{ params: { fields: fields } },
	);

	return response.data;
};
