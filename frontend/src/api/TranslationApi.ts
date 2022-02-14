import axios from 'axios';

import { IChangeLogEntryObject } from '../dto/IChangeLogEntryObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../models/TranslationSortRule';
import { WordCategory } from '../models/WordCategory';
import { IPaginationParams } from '../stores/PaginationStore';

export const createTranslation = async ({
	headword,
	locale,
	reading,
	yamatokotoba,
	category,
}: {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
	category?: WordCategory;
}): Promise<ITranslationObject> => {
	const response = await axios.post<ITranslationObject>('/translations', {
		headword: headword,
		locale: locale,
		reading: reading,
		yamatokotoba: yamatokotoba,
		category: category,
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
}: {
	translationId: number;
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
	category?: WordCategory;
}): Promise<ITranslationObject> => {
	const response = await axios.patch<ITranslationObject>(
		`/translations/${translationId}`,
		{
			headword: headword,
			locale: locale,
			reading: reading,
			yamatokotoba: yamatokotoba,
			category: category,
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
}: {
	translationId: number;
}): Promise<ITranslationObject> => {
	const response = await axios.get<ITranslationObject>(
		`/translations/${translationId}`,
	);

	return response.data;
};

export const listTranslationRevisions = async ({
	translationId,
}: {
	translationId: number;
}): Promise<ISearchResultObject<IChangeLogEntryObject>> => {
	const response = await axios.get<
		ISearchResultObject<IChangeLogEntryObject>
	>(`/translations/${translationId}/revisions`);

	return response.data;
};
