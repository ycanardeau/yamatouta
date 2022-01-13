import axios from 'axios';

import config from '../config';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ITranslationObject } from '../dto/translations/ITranslationObject';
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

	const response = await axios.post<ITranslationObject>(
		`${config.apiEndpoint}/translations`,
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

export const listTranslations = async (params: {
	pagination: IPaginationParams;
}): Promise<ISearchResultObject<ITranslationObject>> => {
	const { pagination } = params;

	const response = await axios.get<ISearchResultObject<ITranslationObject>>(
		`${config.apiEndpoint}/translations`,
		{ params: { ...pagination } },
	);

	return response.data;
};