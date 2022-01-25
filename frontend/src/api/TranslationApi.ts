import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ITranslationObject } from '../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../models/TranslationSortRule';
import { WordCategory } from '../models/WordCategory';
import { IPaginationParams } from '../stores/PaginationStore';

export const createTranslation = async (params: {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
	category?: WordCategory;
}): Promise<ITranslationObject> => {
	const { headword, locale, reading, yamatokotoba, category } = params;

	const response = await axios.post<ITranslationObject>('/translations', {
		headword: headword,
		locale: locale,
		reading: reading,
		yamatokotoba: yamatokotoba,
		category: category,
	});

	return response.data;
};

export const listTranslations = async (params: {
	pagination: IPaginationParams;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}): Promise<ISearchResultObject<ITranslationObject>> => {
	const { pagination, sort, query, category } = params;

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
